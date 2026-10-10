# YouTube niche competition checker (no API key needed)
# Google Colab: pehle cell mein `!pip install -q yt-dlp` chalao, phir yeh poora code paste karo.

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

opts = {"quiet": True, "skip_download": True, "ignoreerrors": True, "no_warnings": True}


def analyse(keyword):
    with yt_dlp.YoutubeDL(opts) as ydl:
        res = ydl.extract_info(f"ytsearch{TOP_N}:{keyword}", download=False)
    rows = []
    today = dt.date.today()
    for v in res.get("entries") or []:
        if not v:
            continue
        up = v.get("upload_date")
        age_days = (today - dt.datetime.strptime(up, "%Y%m%d").date()).days if up else None
        rows.append({
            "title": (v.get("title") or "")[:60],
            "views": v.get("view_count") or 0,
            "subs": v.get("channel_follower_count") or 0,
            "age_days": age_days,
        })
    return rows


def summarise(keyword, rows):
    if not rows:
        print(f"\n{keyword}: koi result nahi mila")
        return
    ages = [r["age_days"] for r in rows if r["age_days"] is not None]
    small = [r for r in rows if r["subs"] < 50_000]
    small_hits = [r for r in small if r["views"] > 100_000]
    print(f"\n=== {keyword} ===")
    print(f"Median views        : {statistics.median(r['views'] for r in rows):,.0f}")
    print(f"Median channel subs : {statistics.median(r['subs'] for r in rows):,.0f}")
    print(f"Median video age    : {statistics.median(ages) / 365:.1f} saal" if ages else "Age: n/a")
    print(f"Chhote channels (<50k subs) : {len(small)}/{len(rows)}")
    print(f"Chhote channel + 100k+ views: {len(small_hits)}  <- jitna zyada, utna acha gap")
    for r in rows:
        age = f"{r['age_days'] / 365:.1f}y" if r["age_days"] is not None else "?"
        print(f"  {r['views']:>12,} views | {r['subs']:>10,} subs | {age:>5} | {r['title']}")


for kw in KEYWORDS:
    summarise(kw, analyse(kw))
