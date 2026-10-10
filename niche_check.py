# YouTube niche competition checker (no API key needed)
# Run:   pip install yt-dlp   then   python niche_check.py
# Google Colab: pehle cell mein `!pip install -q yt-dlp` chalao, phir yeh poora code paste karo.
# Output: screen pe ranked table + niche_report.csv (Excel mein khul jayega)

import csv
import datetime as dt
import statistics

import yt_dlp

KEYWORDS = [
    "small claims court explained",
    "what happens if you get sued",
    "how to dispute a parking ticket",
    "landlord keeping security deposit",
    "what is probate explained",
    "how to write a will",
    "what happens if you die without a will",
    "employment tribunal explained",
]
TOP_N = 15
SMALL_CHANNEL = 50_000  # isse kam subs = chhota channel

opts = {"quiet": True, "skip_download": True, "ignoreerrors": True,
        "no_warnings": True, "noprogress": True}


def fmt(n):
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n / 1_000:.0f}k"
    return str(n)


def fetch(keyword):
    with yt_dlp.YoutubeDL(opts) as ydl:
        res = ydl.extract_info(f"ytsearch{TOP_N}:{keyword}", download=False) or {}
    today = dt.date.today()
    rows = []
    for v in res.get("entries") or []:
        if not v:
            continue
        up = v.get("upload_date")
        age = (today - dt.datetime.strptime(up, "%Y%m%d").date()).days / 365 if up else None
        rows.append({
            "title": v.get("title") or "",
            "channel": v.get("channel") or "",
            "views": v.get("view_count") or 0,
            "subs": v.get("channel_follower_count") or 0,
            "age": age,
            "url": v.get("webpage_url") or "",
        })
    return rows


def score(rows):
    """0-100 opportunity score: demand + small channels winning + stale results."""
    views = statistics.median(r["views"] for r in rows)
    subs = statistics.median(r["subs"] for r in rows)
    ages = [r["age"] for r in rows if r["age"] is not None]
    age = statistics.median(ages) if ages else 0
    small = sum(r["subs"] < SMALL_CHANNEL for r in rows)
    small_hits = sum(r["subs"] < SMALL_CHANNEL and r["views"] > 50_000 for r in rows)

    demand = min(views / 200_000, 1) * 30          # log dekhte hain?
    weak = (small / len(rows)) * 30                # chhote channels rank karte hain?
    stale = min(age / 5, 1) * 20                   # purane videos = gap
    proof = min(small_hits / 3, 1) * 20            # chhote channel ko views mile?
    return {
        "score": round(demand + weak + stale + proof),
        "median_views": views, "median_subs": subs, "median_age": age,
        "small": small, "small_hits": small_hits, "n": len(rows),
    }


def verdict(s):
    if s >= 60:
        return "✅ STRONG GAP"
    if s >= 40:
        return "🟡 POSSIBLE"
    return "❌ CROWDED"


def main():
    results = []
    for i, kw in enumerate(KEYWORDS, 1):
        print(f"[{i}/{len(KEYWORDS)}] Checking: {kw} ...", flush=True)
        rows = fetch(kw)
        if rows:
            results.append((kw, score(rows), rows))

    results.sort(key=lambda x: x[1]["score"], reverse=True)

    line = "=" * 96
    print(f"\n{line}\n  NICHE OPPORTUNITY RANKING  (score 0-100, zyada = better)\n{line}")
    print(f"{'#':<3}{'Keyword':<42}{'Score':>6}  {'Views':>7}{'Subs':>8}{'Age':>7}{'Small':>7}  Verdict")
    print("-" * 96)
    for i, (kw, s, _) in enumerate(results, 1):
        print(f"{i:<3}{kw[:40]:<42}{s['score']:>6}  {fmt(s['median_views']):>7}"
              f"{fmt(s['median_subs']):>8}{s['median_age']:>6.1f}y{s['small']:>4}/{s['n']:<2}  {verdict(s['score'])}")
    print("-" * 96)
    print("Views/Subs/Age = top results ka median | Small = <50k subs wale channels jo top mein hain")

    for kw, s, rows in results[:3]:
        print(f"\n--- TOP PICK: {kw} (score {s['score']}) ---")
        for r in sorted(rows, key=lambda r: r["views"], reverse=True)[:5]:
            age = f"{r['age']:.1f}y" if r["age"] is not None else "?"
            print(f"  {fmt(r['views']):>6} views | {fmt(r['subs']):>6} subs | {age:>5} | {r['title'][:55]}")

    with open("niche_report.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["keyword", "score", "views", "subs", "age_years", "channel", "title", "url"])
        for kw, s, rows in results:
            for r in rows:
                w.writerow([kw, s["score"], r["views"], r["subs"],
                            round(r["age"], 1) if r["age"] is not None else "",
                            r["channel"], r["title"], r["url"]])
    print("\nFull data saved: niche_report.csv")


if __name__ == "__main__":
    main()
