# Netlight ML: YouTube analytics log (from the user's Studio screenshots)

Read by the `light`, `net-shorts` and `net-trends` skills (their "Lessons from YouTube analytics" sections). When the user shares new Studio numbers, add rows here (newest first) and turn a pattern seen in 3+ videos into a rule in the skill it belongs to. Tiny numbers are noisy.

| checked | video | format | published | impressions | CTR | views | avg view duration | stayed vs swiped (Shorts) | main traffic | note |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-10-28 | This AI Rewrote Its Own Code—Then Lied About It (RSI Explained) | long 7:31 | 27 Oct | 3.2k | 0.8 % | 155 | 1:56 (~26 %) | | browse 81 %, suggested 16 % | thumb "SELF-IMPROVING AI BROKE THE LOOP"; the "lied" part comes at ~6:00 |
| 2026-10-28 | This AI Doesn't Write Word by Word (NCM Explained) | long 6:03 | 23 Oct | 8.7k | 0.4 % | 121 | 0:47 (~13 %) | | suggested 54 %, browse 29 %, search 14 % ("ncm") | thumb "LLMs FAILED 86% SOLVED" says something else than the title; tokens + diffusion lecture right after the hook |
| 2026-10-28 | Why Your Voice Isn't Safe From AI Anymore | long 7:22 | 22 Oct | 176 | 4.0 % | 17 | 1:16 (~17 %) | | search 35 %, suggested 35 % | thumb "OLD TTS VS CODEC" (jargon); YouTube barely showed it |
| 2026-10-28 | 19 Neurons vs Giant AI: The Liquid Network (Explained) | long 6:22 | 20 Oct | 740 | 3.8 % | 92 | 2:29 (~39 %) | | browse 66 %, search 12 % ("liquid ai") | best: number + contrast hook, everyday examples, promise back by the middle |
| 2026-10-28 | What If AI Could Learn to Forget? (Mamba Explained) | long 8:05 | 18 Oct | | | 451 | 1:56 (~24 %) | | recommendations 92 % (Home 79 %) | most views, +2 subs; history of recurrent / state space models before Mamba arrives |
| 2026-10-28 | Ghidra Failed. An AI Agent Didn't. (REA Explained) | long 5:27 | 15 Oct | 2.1k | 3.5 % | 598 | 1:48 (~33 %) | | browse 73 %, search 24 % ("rea ghidra") | REA / MCP / disassembly lecture first, the 63-byte case at ~4:00 |
| 2026-10-28 | AI That Taught Itself and Won 100-0 | Short 0:39 | 27 Oct | | | 29 engaged | 0:15 | 40.9 % / 59.1 % | | |
| 2026-10-28 | How AI Video Generation Actually Works | Short 1:00 | 26 Oct | | | 146 engaged | 0:32 | 49.7 % / 50.3 % | | 188 words, 9 ideas; 0:00 frame black |
| 2026-10-28 | NCM Isn't the End of LLMs. Here's What It Does. | Short 0:46 | 25 Oct | | | 358 engaged | 0:29 | 62.6 % / 37.4 % | | best Short: "here is the catch" twist + short payoff; still 5 jargon words, 0:00 frame black |

Older math Shorts (higher-dimension ball, Gabriel's horn, birthday paradox, bell curve, Monte Carlo pi, 4-D cube): 1-2k views each, against 68-860 for the AI Shorts. One strange visual + one plain question.

## Lessons (28 Oct 2026)
1. **Click rate died on acronyms and mixed claims.** The two videos YouTube showed most (NCM 8.7k, RSI 3.2k impressions) got 0.4-0.8 %: acronym titles, and a thumbnail that said something else than the title. A plain claim + one number ("19 Neurons Beat Giant AI") got 3.8 %.
2. **Viewers left at the first background lecture after the hook** (average watch time mapped onto each script at ~155 words a minute): NCM at tokens + diffusion (0:47), REA at MCP + disassembly (~1:50), Mamba at the recurrent / state space history (~2:00), RSI at the abstract 4-step loop (~2:00).
3. **The title's promise came minutes late:** RSI "lied" at ~6:00, REA "63 bytes" at ~4:00, NCM promised Sudoku and then translated German for 4 minutes. Show the promised thing in the first minute, explain how after.
4. **Every script used the same template lines** ("Stick with me...", "Now here's the twist", "Quick question for you", "To be clear", "let's be honest, because this isn't magic", "So here's my question for you... comments"). `light/scriptcheck.py` refuses them; `light/scripts/` keeps every published script so reused phrases show up.
5. **Shorts: the 0:00 frame was black** (the kit faded the first scene in, every part came after the voice). Fixed: `HOOK([...])`, lbuild + lcheck `HOOK0`. Shorts are now 30-40 s (75-100 words), 3-4 beats, at most one technical word. `nlCaptions()` in the beats showed every caption at once: refused now.

Still unknown (ask next time): the retention graph of each long video (where exactly the drop is), and the Shorts numbers of a Short made with the new rules.
