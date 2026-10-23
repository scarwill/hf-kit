# Short 1: PHP2Shell, the secret that leaked three times (23 Oct 2026)

## Sources
1. PHP Foundation, "Today's PHP security release, and how we're strengthening PHP security", 21 Oct 2026. https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/
   - Two critical vulns (CVE-2026-109618, CVE-2026-109619), unauthenticated attacker can execute code on servers running PHP. Fixed in 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35.
   - "On Tuesday, October 20th, at around 15:00 UTC, the two CVE IDs began circulating on online forums and social media." Wrong release time, wrong CVSS 10.0 (real 9.2). "No technical details leaked."
   - Release moved from Oct 22 14:00 UTC to Oct 21 14:00 UTC.
   - Around 20:00 UTC, Calif (a firm that reported the bugs) "mistakenly published a video" of its PoC working against targets; copies circulated.
   - "On October 21st at 07:41 UTC, more than six hours before the coordinated release, Chainguard unilaterally broke the embargo and published built images containing the fix." "Any attacker could now study the fix in binary form."
2. Hacker News, petecooper, "Tell HN: I unknowingly broke the PHP RCE embargo. I am sorry", 22 Oct 2026 10:11 UTC, 676 points. https://news.ycombinator.com/item?id=50193416
   - "I am truly sorry. I take full responsibility for my actions." Was told there was no embargo.
   - His comment (id 50183326, 21 Oct): "This was partly me. I take responsibility for posting it on HN."
3. AWS Security Blog, Amazon Threat Intelligence, PHP2Shell exploitation prior to public disclosure (MadPot honeypots). https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/ (opened directly 23 Oct: "exploitation attempt dating to Oct. 17, 2026, in MadPot telemetry"; by CJ Moses, 21 Oct 2026)
   - First exploitation attempts Saturday 17 Oct, four days before patches. CJ Moses (AWS CISO): "it remains unclear how the actor acquired exploit information prior to disclosure." Multiple actors.
4. BleepingComputer, "Amazon says PHP2Shell exploitation began 4 days before patches", 22 Oct 2026. https://www.bleepingcomputer.com/news/security/amazon-says-php2shell-exploitation-began-4-days-before-patches/
5. BleepingComputer, "PHP shares mitigation for new RCE vulnerability with no patch", 23 Oct 2026. https://www.bleepingcomputer.com/news/security/php-shares-mitigation-for-new-and-unpatched-rce-vulnerability/
   - CVE-2026-115560, no patch; only with "an unusual combination of configuration and application code". Mitigation session.upload_progress.enabled=0.
   - Dataminr TRACE: "limited to scanning, fingerprinting, and use of non-working exploits, with no known compromises."
6. php.net front page notice, 23 Oct 2026. https://www.php.net/ (mitigation text, same as above)

## Script line -> source
| line | source |
|---|---|
| secret release date, leaked three times (IDs, video, Chainguard) | 1 |
| two critical bugs, run code on PHP servers | 1 |
| Oct 20 bug IDs spread on forums | 1 |
| developer on Hacker News, "I am truly sorry" | 2 |
| security firm posted exploit video by mistake | 1 (Calif) |
| Chainguard shipped fix six hours early | 1 |
| Amazon traps hit Oct 17, three days before any leak (first leak Oct 20) | 3, 4, 1 |
| nobody knows how they knew | 3/4 (CJ Moses quote) |
| no successful hack confirmed yet | 5 (Dataminr), 4 ("unclear if any would have succeeded") |
| third bug, no patch, rare setup | 5, 6 |
| turn off session upload progress | 5, 6 |

Note: "three times" = the three leaks named by the PHP Foundation (IDs on forums, Calif video, Chainguard images). The PHP Foundation also says mitigation advice "may have leaked as well", so "at least three" is the safe reading.
