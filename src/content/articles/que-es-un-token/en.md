---
title: What is a token
description: Artificial intelligence doesn't read letters or words. It reads tokens. What they are, who decides them and what quirks they cause.
date: 2026-11-04
translatedWithAI: true
draft: false
---

## Before we start

Hi! This is the first article of a series I'm starting called **Lo técnico para no técnicos** (tech stuff for non-tech people), made to understand today's artificial intelligence from scratch, without needing to know anything about computers. Each article builds on the previous one, and this is the very first. They'll come out every Wednesday at 1:00 PM (UTC-5). I hope you like it and that it helps you learn. Thanks for reading!

## The token, a word that's everywhere

If you use ChatGPT, Claude, Gemini or any other AI, you've surely already run into tokens, even if you don't know it.

- When the AI tells you that you've hit your usage limit, what ran out is mostly tokens.
- When an AI company publishes its prices, it charges for every million tokens.
- When they launch a new AI, they brag that it can read or generate X amount of tokens.

Everyone counts them and everyone charges for them, but almost nobody explains what they are. In this article I'll explain it to you. Let's see: what a token is, who decides what each one looks like and what quirks they cause.

## Letters or words?

First, a secret: computers don't understand letters, only numbers. So, before reading a text, the AI cuts it into pieces and gives each piece a number, and here the question is: what do we use as a piece?

There are two obvious ideas, and both have a problem.

- **One letter.** It's easy: there are few letters. The problem is that the text becomes really long, because the AI does the same work for every piece it reads, so reading letter by letter makes it very slow.
- **One word.** This way the text stays short. The problem here is that you'd need millions of numbers, and even then words would be missing: names, typos, new words, a "hahahaha" that becomes a different word if you add another "ha". And the AI can't read what isn't on its list.

The solution is in the middle: **a piece of a word**. Let's imagine Lego: for the most common parts there are big pieces ready to use, but the smaller or trickier parts are built with smaller pieces. And that way we can build anything.

That's a **token**: a piece of a word, or a whole word, that repeats a lot. In the Spanish sentence "El uno es indiscutiblemente menor que el dos." ("One is unquestionably less than two."), "uno" is a single token because it showed up a lot in the training texts. On the other hand, "indiscutiblemente" is 4 tokens: "ind", "isc", "ut" and "iblemente"[^1], probably because it was repeated less in the texts.

To get the idea better, try it yourself in this interactive artifact. Write a sentence and cut it in the three ways to see the difference:

[Three ways to cut a sentence](/articulos/que-es-un-token/cortar-en.html)


## Who decides what a piece is?

This is where the **tokenizer** comes in, mentioned in the previous artifact. It turns out nobody writes the list of tokens by hand: it's built by this program, which is trained before the AI is trained. It's trained by reading a huge amount of text, and it plays a very simple game:

1. It starts with each letter as a separate piece.
2. It looks for the pair of neighboring pieces that repeats the most in the whole text.
3. It joins that pair into a new piece.
4. It goes back to step 2, again and again, in a loop.

What repeats the most ends up as a single piece; what's rare stays in pieces. Look at the next artifact to understand the process better. The words are in Spanish: "gato" is cat, "pato" is duck and "pata" is paw.

[The pair-joining game](/articulos/que-es-un-token/juntar-en.html)

After three joins, "gato", which appears a lot, is already a single piece; "pato", which appeared a couple of times, ended up in two parts ("p" and "ato"); and "pata", the one that appears the least, ended up split in three ("p", "at" and "a"). Careful: at this point the program doesn't know what any word means. It only counts, creates the tokens and gives them their ID (the number it gives each piece).

The tokenizers of today's AI play the same game, just at a huge scale, with tons of text from the internet. GPT-5's tokenizer, for example, made about 200,000 joins. This game has a technical name: BPE (*Byte-Pair Encoding*).

## Two quirks caused by tokens

### 1. It doesn't see the letters

A while ago, a well-known test was asking AI how many letters "r" the word "strawberry" has, and it usually got it wrong[^2]. This is because AI doesn't see letters: it reads tokens. Written on its own, "strawberry" is 3 tokens ("st", "raw", "berry"), and inside a question in English it's just one. The letters are hidden inside.

It's as if you knew the concept and the look of a road, and someone showed you a photo of a road and asked you how many r's it has. You know what a road is, but there are no letters in the photo, and since you don't see the word, you don't know the right answer.

Now, these days AI usually gets it right because, before answering, it writes the word letter by letter: s-t-r-a-w-b-e-r-r-y. That way each letter ends up in its own token and it can count them. It still doesn't see the letters: it learned a trick to dodge the problem and get to the answer.

### 2. Spanish uses more tokens than English

The same sentence in both languages:

| Sentence | Tokens |
|---|---|
| "Unfortunately, the keys were lost this morning." | 9 |
| "Desafortunadamente las llaves se perdieron esta mañana." | 13 |

With long words it's more noticeable. "Unfortunately" is a single token. "Desafortunadamente", on the other hand, is four tokens ("Des", "af", "ortun" and "adamente").

Why does this happen? Because of the pair-joining game: there's much more text in English on the internet, so English words were repeated more and stayed whole, like "gato". Spanish words, on the other hand, more often stayed in pieces, like "pata". And since AI companies charge per token, using AI in Spanish costs a bit more.

## Quick summary

- AI doesn't read letters or words: it reads **tokens**, pieces of words or whole words that repeat a lot.
- Each token is a number; AI only sees a row of numbers.
- The list of tokens comes from a game: joining the pair that repeats the most, again and again.
- Understanding the token, we understand why counting letters is hard for it and why Spanish uses more tokens.

## The end

Once again, thank you so much for reading this article, I hope it was useful. Remember you can follow me on **[X](https://x.com/rubensalas_dev)** or **[LinkedIn](https://www.linkedin.com/in/ruben-salas17/)** for more content, and if you have any questions, comments or topic suggestions, my DMs are open. I'll be happy to answer you.

Remember that the articles in the series will come out every Wednesday at 1:00 PM (UTC-5). In the next article we'll see what the AI does with those tokens. Spoiler: it tries to predict which one comes next.

---

[^1]: Verified with [OpenAI's tokenizer](https://platform.openai.com/tokenizer).
[^2]: See a [post](https://community.openai.com/t/incorrect-count-of-r-characters-in-the-word-strawberry/829618) about this example, discussed with GPT-4 in 2024.
