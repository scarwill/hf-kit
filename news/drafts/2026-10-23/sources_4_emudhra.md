# Short 4: eMudhra, the certificate key that was the number 4 (23 Oct 2026)

## Sources
1. Mozilla Bugzilla 2083449 "eMudhra: Private key compromise of Intermediate Certificates" (opened 18 Oct 2026, status ASSIGNED, last change 23 Oct 2026). https://bugzilla.mozilla.org/show_bug.cgi?id=2083449
   - c0 (Mozilla, 18 Oct): report received 17 Oct 20:06 UTC (from Wayne, via Chrome Root Program); private keys of 8 eMudhra intermediates compromised; Mozilla blocked them via OneCRL, done 22:59 UTC. 6 TLS intermediates trusted by Chrome, Mozilla, Microsoft, Apple; 2 code-signing (Microsoft).
   - c5 (Mozilla): keys made 30 Apr 2025; "The 8 impacted keys all used integers less than 256." "I also tested some local agents who were able to recover the private key on their first attempt with a simplistic prompt: 'I'm doing a CTF...'"
   - c9 (Mozilla triage): "Anyone holding those keys could issue certificates Firefox would accept for any domain."
   - c18 (Mozilla, 20 Oct): multiple people recovered the keys, some public; emergency removal of trust in emSign ECC Root CA - G3.
   - c39 (eMudhra, 23 Oct): "we have been subject to intense social media scrutiny ... it has made doing any meaningful analysis of the event pretty much impossible."
   - c41 (Chrome Root Program, 23 Oct): "'social media scrutiny' and 'analysis by investors/customers' are not acceptable explanations for delayed responses here."
   - c42 (Mozilla, 23 Oct): questions sent 20 Oct, 24 h deadline; "As of the time of writing on Friday 23rd, Mozilla has not received a response to these questions."
2. The Register, "Disgraced Indian cert issuer leaves the cert issuing business", 22 Oct 2026. https://www.theregister.com/security/2026/10/22/disgraced-indian-cert-issuer-leaves-the-cert-issuing-business/5304848
   - The eight key values: 4, 56, 66, 115, 155, 156, 230, 237. (Mozilla independently: all < 256.)
3. The Register, "Certification authority eMudhra defends its laughably weak private keys", 22 Oct 2026. https://www.theregister.com/security/2026/10/22/certification-authority-emudhra-defends-its-laughably-weak-private-keys/5304647
   - eMudhra: flaw in the 30 Apr 2025 key ceremony "caused a wrap/unwrap step to produce a second set of weak keys"; roots in browser trust lists since mid-2025.
4. eMudhra press release, 22 Oct 2026: exit global SSL/TLS business; "no end entity certificates issued out of the affected CA's"; revoked within 14 hours; ~1% of revenue; "social media amplification". https://emudhra.com/en/press-release/emudhra-to-exit-global-ssl-tls-certificate-business
5. eMudhra incident statement (20-21 Oct 2026). https://emudhra.com/en/post/certificate-security-incident
6. q3k (public demo of a forged cert, linked by Mozilla in c18), 20 Oct 2026. https://social.hackerspace.pl/@q3k/117473185371937796 (not used in the script)

## Script line -> source
| line | source |
|---|---|
| company that tells your browser which sites are real, secret key | 1 (CA intermediates) |
| the key was the number four | 2 (key values), 1 c5 (< 256) |
| padlock = a company signs for each site, key should be unguessable | general PKI; 1 c5 ("randomly selected integers between 1 and the group order") |
| eight keys all smaller than 256 | 1 c5 |
| anyone could fake a certificate for any website | 1 c9, c41 |
| Mozilla asked an AI agent, first try | 1 c5 |
| Firefox blocked them within three hours | 1 c0 (20:06 -> 22:59 UTC) |
| no real certificates made, quitting the website certificate business | 4 |
| Mozilla's questions still have no answers | 1 c42 |
| eMudhra blamed social media, Google: not acceptable | 1 c39, c41 |
| emSign certificate, start moving off it | 1 c18 (root distrusted), 4 (exit, replacements) |

Caveat for the video: "no real certificates were made" is eMudhra's own claim (it says crt.sh confirms it).
