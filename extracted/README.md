# Extracted Content

Machine-readable text and images extracted from the documents in [`sources/`](../sources/).

- **Text** — extracted per page into one Markdown file per document. Pages with an embedded
  text layer use it directly; image-only pages were OCR'd with Tesseract (marked `(OCR)` in
  the page headings). The Hebrew-alphabet document was OCR'd with `eng+heb`.
- **Images** — embedded raster images extracted per page into each document's `images/`
  folder. Native JPEG streams are kept as `.jpg`; all other formats are converted to
  lossless `.png`. Duplicate images (same PDF object reused on several pages) are saved once.
  Purely vector pages with no text are captured as full-page PNG renders.

`sources/COSMOS_SYSTEM_RN_PK_COMPLETE_ANALYSIS (1).md` and `sources/chainlinkies.py` are
already machine-readable text, so no extraction was needed for them.

| Source document | Extracted folder | Pages | Text-layer pages | OCR pages | Images |
|---|---|---:|---:|---:|---:|
| 3D Penta-Floral SacredSemioSol2 SPHERE.pdf | [3d-penta-floral-sacredsemiosol2-sphere](3d-penta-floral-sacredsemiosol2-sphere/) | 2 | 2 | 0 | 2 |
| Connecting The Many Awesomes! (Integral, Pattern D and More).pdf | [connecting-the-many-awesomes-integral-pattern-d-and-more](connecting-the-many-awesomes-integral-pattern-d-and-more/) | 26 | 24 | 2 | 27 |
| Creating Human Community (Generative Codes) - Christopher Alexander.pdf | [creating-human-community-generative-codes-christopher-alexander](creating-human-community-generative-codes-christopher-alexander/) | 4 | 4 | 0 | 0 |
| DNA 384 - COL2.pdf | [dna-384-col2](dna-384-col2/) | 22 | 22 | 0 | 1 |
| Implementing First-Order Rewriting with Constructor Systems - Satish Thatte.pdf | [implementing-first-order-rewriting-with-constructor-systems-satish-thatte](implementing-first-order-rewriting-with-constructor-systems-satish-thatte/) | 10 | 10 | 0 | 373 |
| Initiates of the Flame - MPH.pdf | [initiates-of-the-flame-mph](initiates-of-the-flame-mph/) | 81 | 80 | 1 | 47 |
| Reconstructing the Narrative - A Literary Antidote to the Meaning Crisis - XD3 Xz RGB 2gY3.pdf | [reconstructing-the-narrative-a-literary-antidote-to-the-meaning-crisis-xd3-xz-rgb-2gy3](reconstructing-the-narrative-a-literary-antidote-to-the-meaning-crisis-xd3-xz-rgb-2gy3/) | 36 | 36 | 0 | 9 |
| Sys 5 - Dan Explorations - v7.pdf | [sys-5-dan-explorations-v7](sys-5-dan-explorations-v7/) | 69 | 65 | 4 | 59 |
| System 1-8 - Genesis (Tentative Associations).pdf | [system-1-8-genesis-tentative-associations](system-1-8-genesis-tentative-associations/) | 7 | 7 | 0 | 19 |
| T-9 Primary Universal Term.pdf | [t-9-primary-universal-term](t-9-primary-universal-term/) | 1 | 0 | 1 | 1 |
| T1-1 perception of need.pdf | [t1-1-perception-of-need](t1-1-perception-of-need/) | 1 | 0 | 1 | 1 |
| T1-2 assessment of need.pdf | [t1-2-assessment-of-need](t1-2-assessment-of-need/) | 1 | 0 | 1 | 1 |
| T1-3 (Virtual Image Triad) - System 5 - Bob - Re_ Back in Thailand.pdf | [t1-3-virtual-image-triad-system-5-bob-re-back-in-thailand](t1-3-virtual-image-triad-system-5-bob-re-back-in-thailand/) | 3 | 2 | 1 | 4 |
| The Flame-Hand Letters of the Hebrew Alphabet.pdf | [the-flame-hand-letters-of-the-hebrew-alphabet](the-flame-hand-letters-of-the-hebrew-alphabet/) | 28 | 28 | 0 | 28 |
| The Language of Creation - Cosmic Symbolism in Genesis - Matthieu Pageau.pdf | [the-language-of-creation-cosmic-symbolism-in-genesis-matthieu-pageau](the-language-of-creation-cosmic-symbolism-in-genesis-matthieu-pageau/) | 285 | 284 | 1 | 2080 |
| The Unicorns Horn.pdf | [the-unicorns-horn](the-unicorns-horn/) | 30 | 30 | 0 | 36 |
