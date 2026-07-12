// Anthony Mauclair — revision hub behaviour + term bank.
// The glossary notes are mine: things that worked, things I keep getting wrong.

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const navLinks = $$(".nav-menu a");
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");
const progressBar = $("#progress");
const toTopButton = $("#toTop");
const sections = $$("#main > section[id]");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) {
      return;
    }

    const target = $(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (navMenu && navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
  });
});

let revealObserver = null;

function attachReveal(elements = $$(".reveal")) {
  if (!elements.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("show"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }

  elements.forEach((element) => {
    if (!element.classList.contains("show")) {
      revealObserver.observe(element);
    }
  });
}

attachReveal();

let isTicking = false;

function updateScrollUI() {
  if (isTicking) {
    return;
  }

  isTicking = true;

  window.requestAnimationFrame(() => {
    const root = document.documentElement;
    const total = Math.max(1, root.scrollHeight - root.clientHeight);
    const scrolled = root.scrollTop / total;

    if (progressBar) {
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, scrolled))})`;
    }

    if (toTopButton) {
      toTopButton.classList.toggle("show", scrolled > 0.12);
    }

    let activeId = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 160 && rect.bottom >= 160) {
        activeId = `#${section.id}`;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === activeId);
    });

    isTicking = false;
  });
}

document.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();

if (toTopButton) {
  toTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ------------------------------------------------------------------
// Term bank. Definitions kept short; the italic note underneath each
// card is my own — where a term earned its place or tripped me up.
// ------------------------------------------------------------------
const glossaryTerms = [
  { term: "Active voice", category: "Grammar",
    definition: "The subject does the action: \"the crowd cheered\", not \"cheers came from the crowd\".",
    note: "Passive is the interesting one to spot. Active is just the default." },
  { term: "Adjective", category: "Grammar",
    definition: "A describing word attached to a noun.",
    note: "Only worth mentioning when the choice is odd or loaded." },
  { term: "Adverb", category: "Grammar",
    definition: "Modifies a verb or adjective — how, when, how often, how much." },
  { term: "Analysis", category: "Argument",
    definition: "Explaining how a specific choice creates meaning, rather than just naming or describing it.",
    note: "The gap between \"the poster uses red\" and \"the red frames the product as urgent\"." },
  { term: "Alliteration", category: "Language",
    definition: "Repeated consonant sounds at the starts of nearby words.",
    note: "Slogans love it. Say what the sound is doing, or it's just spotting." },
  { term: "Allusion", category: "Language",
    definition: "An indirect reference to another text, event or cultural idea.",
    note: "Borrowed meaning — the text imports everything the reference already carries." },
  { term: "Ambiguity", category: "Language",
    definition: "Wording that genuinely supports more than one reading.",
    note: "Give both readings, then commit to the stronger one. Don't sit on the fence." },
  { term: "Anaphora", category: "Language",
    definition: "Starting successive lines or clauses with the same words.",
    note: "The Smiths use it to build obsession — the same plea circling back again and again." },
  { term: "Angle", category: "Visual",
    definition: "Where the camera or artist places the viewer relative to the subject.",
    note: "Low angle means power, high angle means vulnerability. Almost suspiciously reliable." },
  { term: "Antithesis", category: "Language",
    definition: "Two opposed ideas set against each other in balanced phrasing." },
  { term: "Aside", category: "Literature",
    definition: "A line spoken to the audience that the other characters on stage can't hear.",
    note: "Instant dramatic irony — we know, they don't." },
  { term: "Assonance", category: "Language",
    definition: "Repeated vowel sounds inside nearby words.",
    note: "I mix this up with alliteration under time pressure. Vowels = assonance." },
  { term: "Audience", category: "Argument",
    definition: "Whoever the text is actually built for.",
    note: "Every paragraph should land on what the choice does to them." },
  { term: "Authorial intent", category: "Argument",
    definition: "What the writer seems to want the audience to think, feel or question.",
    note: "Keep the word \"seems\" — I can argue intent, I can't read minds." },
  { term: "Background", category: "Visual",
    definition: "Whatever sits behind the main subject.",
    note: "In the newspaper-dress photo the bare background is the point: nothing distracts from the material." },
  { term: "Blank verse", category: "Literature",
    definition: "Unrhymed lines in iambic pentameter.",
    note: "Shakespeare's default setting for high-status speech." },
  { term: "Bleed", category: "Visual",
    definition: "When an image runs off the edge of the frame with no border.",
    note: "Makes a cartoon feel like it doesn't stop at the page." },
  { term: "Body of work", category: "Oral & IO",
    definition: "Several related non-literary texts by the same creator.",
    note: "One Donnelly cartoon is an example. Five are a body of work. The IO needs the second." },
  { term: "Call to action", category: "Visual",
    definition: "The line that tells the audience exactly what to do next.",
    note: "A recruitment poster is basically one giant call to action with art around it." },
  { term: "Caption", category: "Visual",
    definition: "The written line under or inside an image.",
    note: "In Donnelly the caption usually delivers the punch — the drawing just sets it up." },
  { term: "Caricature", category: "Visual",
    definition: "Exaggerating someone's features to make a point about them." },
  { term: "Caesura", category: "Literature",
    definition: "A pause in the middle of a line, usually made by punctuation.",
    note: "In Larkin it can sound like a thought stopping short of hope." },
  { term: "Claim", category: "Argument",
    definition: "An arguable point that evidence can support.",
    note: "If nobody could possibly disagree with it, it isn't a claim." },
  { term: "Clause", category: "Grammar",
    definition: "A unit of language with its own subject and verb." },
  { term: "Cliche", category: "Language",
    definition: "A phrase so overused it has stopped meaning anything.",
    note: "Banned from my essays. Also banned: \"paints a picture\"." },
  { term: "Colloquial language", category: "Language",
    definition: "Casual, everyday speech showing up in print.",
    note: "Creates closeness — or quietly marks a character as ordinary." },
  { term: "Colour palette", category: "Visual",
    definition: "The overall range of colours an image commits to.",
    note: "Name the mood it builds before listing the colours." },
  { term: "Comparative thesis", category: "Argument",
    definition: "One argument covering how both texts treat the same idea.",
    note: "Paper 2 lives or dies here. Write it before anything else." },
  { term: "Composition", category: "Visual",
    definition: "How everything in the frame is arranged.",
    note: "My first stop with any poster: what did they put where, and why there." },
  { term: "Connotation", category: "Language",
    definition: "What a word suggests beyond its literal meaning.",
    note: "\"Childish\" vs \"childlike\" — same denotation, opposite verdicts." },
  { term: "Contraction", category: "Grammar",
    definition: "Shortened forms like can't and I'm.",
    note: "Makes a written voice sound spoken." },
  { term: "Context", category: "Argument",
    definition: "The circumstances around a text — social, historical, cultural.",
    note: "Seasoning, not the meal. The text itself stays central." },
  { term: "Contrast", category: "Visual",
    definition: "A strong difference the text forces you to notice.",
    note: "The golf ad is pure contrast: relaxed swing, brutal object." },
  { term: "Critique", category: "Argument",
    definition: "When a text challenges an idea or system instead of just showing it.",
    note: "Upgrades my verbs: the text critiques something, it doesn't \"talk about\" it." },
  { term: "Crop", category: "Visual",
    definition: "What the frame deliberately cuts out.",
    note: "What's missing can matter more than what's there." },
  { term: "Dash", category: "Grammar",
    definition: "The punctuation of interruption — or a sudden change of direction." },
  { term: "Declarative sentence", category: "Grammar",
    definition: "A plain statement of fact or belief.",
    note: "A run of them can sound like someone refusing to argue." },
  { term: "Demotic language", category: "Language",
    definition: "Ordinary, street-level speech.",
    note: "Larkin drops into it on purpose — the flatness is the weapon." },
  { term: "Depth of field", category: "Visual",
    definition: "How much of the image stays in focus from front to back.",
    note: "A blurred background means the photographer chose your focal point for you." },
  { term: "Dialogue", category: "Literature",
    definition: "Characters talking to each other.",
    note: "Watch who interrupts whom — it tells you who holds the power." },
  { term: "Diction", category: "Language",
    definition: "The writer's word choices.",
    note: "Fastest route to tone. When I'm stuck, I start here." },
  { term: "Direct gaze", category: "Visual",
    definition: "The subject looks straight out at the viewer.",
    note: "Recruitment posters weaponise it — you, specifically, are being asked." },
  { term: "Dramatic irony", category: "Literature",
    definition: "The audience knows something a character doesn't.",
    note: "Romeo and Juliet runs on it: the prologue hands us the ending, then makes us watch." },
  { term: "Ellipsis", category: "Grammar",
    definition: "Three dots marking something left unsaid...",
    note: "Trailing off, hesitation, or a threat — depends entirely on the tone around it." },
  { term: "Emotional blackmail", category: "Visual",
    definition: "Persuasion that works through guilt or shame.",
    note: "The WW1 posters that have children ask their fathers what they did in the war. Vicious, and effective." },
  { term: "Emotive language", category: "Language",
    definition: "Words picked to make you feel before you think.",
    note: "Duty, glory, sacrifice — the recruitment poster starter pack." },
  { term: "Emanata", category: "Visual",
    definition: "The little cartoon marks for motion or feeling — sweat drops, radiating lines." },
  { term: "Endorsement", category: "Visual",
    definition: "A respected figure lending their authority to the message." },
  { term: "End-stopped line", category: "Literature",
    definition: "A poetic line that closes with punctuation.",
    note: "Control and finality. Pairs neatly with enjambment for a structure point." },
  { term: "Enjambment", category: "Literature",
    definition: "The sentence spills past the end of the line.",
    note: "Overflow, momentum, a thought that won't be contained by the form." },
  { term: "Evidence", category: "Argument",
    definition: "The actual words or details my point is built on.",
    note: "Short quotes only. If I'm quoting three lines, I'm hiding, not arguing." },
  { term: "Evaluation", category: "Argument",
    definition: "Judging how well a choice works, not just describing what it does.",
    note: "The word teachers keep writing in my margins. There's a reason." },
  { term: "Euphemism", category: "Language",
    definition: "A soft phrase laid over a hard truth.",
    note: "\"Collateral damage.\" Ask what's being hidden and who benefits from the hiding." },
  { term: "Exclamation mark", category: "Grammar",
    definition: "Emphasis, force, volume.",
    note: "In propaganda it's essentially shouting." },
  { term: "Expletive", category: "Language",
    definition: "Swearing, or a sudden forceful outburst.",
    note: "Analyse the register shift; don't just note that it's rude." },
  { term: "Field of inquiry", category: "Oral & IO",
    definition: "The broad territory a global issue sits inside — politics, identity, culture.",
    note: "Pick the field first, then sharpen it into an actual issue." },
  { term: "Figurative language", category: "Language",
    definition: "Anything not meant literally.",
    note: "Umbrella term. Name the specific device whenever I can." },
  { term: "First person", category: "Grammar",
    definition: "I, me, my.",
    note: "Confessional by default. The Smiths never leave it." },
  { term: "Foreshadowing", category: "Literature",
    definition: "An early hint of what's coming later." },
  { term: "Foreground", category: "Visual",
    definition: "The front of the image, nearest the viewer.",
    note: "Front versus back is often the whole social argument of a photograph." },
  { term: "Framing", category: "Visual",
    definition: "Where the borders fall and what they trap inside.",
    note: "A figure alone in a wide frame reads as isolated before you've noticed anything else." },
  { term: "Global issue", category: "Oral & IO",
    definition: "An issue with real weight across countries and cultures — the spine of the IO.",
    note: "The test: does it genuinely live in both texts, or am I forcing it?" },
  { term: "Graphic weight", category: "Visual",
    definition: "How heavily an element pulls the eye — dark lines, bold shapes, dense detail." },
  { term: "Gutter", category: "Visual",
    definition: "The gap between comic panels.",
    note: "The reader fills it in themselves — and what's imagined is often worse than what's drawn." },
  { term: "Hyperbole", category: "Language",
    definition: "Deliberate exaggeration.",
    note: "In the Smiths the exaggeration is the emotional truth — the speaker means every word of it." },
  { term: "Iambic pentameter", category: "Literature",
    definition: "Ten syllables, unstressed then stressed, five times per line.",
    note: "When Shakespeare breaks the rhythm, that's exactly where to look." },
  { term: "Iconography", category: "Visual",
    definition: "Symbols a culture reads instantly.",
    note: "Poppies, doves, skulls. No caption needed — which is the whole power of it." },
  { term: "Idiom", category: "Language",
    definition: "A fixed phrase that doesn't mean its literal words." },
  { term: "Imagery", category: "Language",
    definition: "Language that makes you see, hear or feel the thing.",
    note: "Say which sense and what it triggers. \"Vivid imagery\" on its own is filler." },
  { term: "Imperative verb", category: "Grammar",
    definition: "A command: go, stop, buy, enlist.",
    note: "The baby cartoon is a whole list of them — orders dressed up as advice." },
  { term: "Inference", category: "Argument",
    definition: "A conclusion the evidence supports without stating it outright.",
    note: "Reasonable inference is a skill. Guessing someone's motives is fan fiction." },
  { term: "Interrogative sentence", category: "Grammar",
    definition: "A sentence in the form of a question." },
  { term: "Interpretation", category: "Argument",
    definition: "My reading of what a detail means.",
    note: "Turns evidence into argument. This is where the marks actually live." },
  { term: "Irony", category: "Language",
    definition: "The gap between what's said or shown and what's actually meant.",
    note: "The golfer's calm smile is the irony. The axe just makes it visible." },
  { term: "Juxtaposition", category: "Language",
    definition: "Two contrasting things placed right next to each other.",
    note: "Probably my most-used word in visual analysis. Should branch out." },
  { term: "Label", category: "Visual",
    definition: "Words written inside a cartoon naming what things stand for.",
    note: "Political cartoons use them so the symbolism can't be missed." },
  { term: "Layout", category: "Visual",
    definition: "Where text and images sit on the page." },
  { term: "Lexical field", category: "Language",
    definition: "A cluster of words drawn from the same topic.",
    note: "Three war words in a love poem is an actual finding. Say so." },
  { term: "Line of argument", category: "Argument",
    definition: "The through-line of an essay — each point building on the last.",
    note: "If my paragraphs could be shuffled without anyone noticing, I don't have one." },
  { term: "Message", category: "Argument",
    definition: "The idea the text wants to leave you holding.",
    note: "Every paragraph links back here, or it's decoration." },
  { term: "Metaphor", category: "Language",
    definition: "Saying one thing is another thing.",
    note: "Compresses a whole feeling into a single image. Unpack the image, not just the label." },
  { term: "Minor sentence", category: "Grammar",
    definition: "A fragment used deliberately. Like this.",
    note: "Punchy, abrupt, final. Best kept rare." },
  { term: "Modal verb", category: "Grammar",
    definition: "Might, must, should, could — the verbs of certainty and obligation.",
    note: "A \"must\" on a poster is doing political work." },
  { term: "Monologue", category: "Literature",
    definition: "One character speaking at length." },
  { term: "Mood", category: "Literature",
    definition: "What the audience is made to feel.",
    note: "Tone belongs to the writer; mood belongs to us. I have to keep re-learning this." },
  { term: "Motif", category: "Language",
    definition: "An image or idea that keeps returning through the text.",
    note: "Light, in the song of the same name — track it through the verses and the analysis writes itself." },
  { term: "Narrator", category: "Literature",
    definition: "The voice telling the story.",
    note: "Never assume it's the author. Sometimes it isn't even honest." },
  { term: "Negative space", category: "Visual",
    definition: "The emptiness around the subject.",
    note: "The Chupa Chups ad is mostly empty. The emptiness is the joke." },
  { term: "Noun phrase", category: "Grammar",
    definition: "A noun plus the cluster of words modifying it." },
  { term: "Onomatopoeia", category: "Language",
    definition: "Words that sound like the thing they mean." },
  { term: "Oxymoron", category: "Language",
    definition: "Two contradictory words jammed together.",
    note: "Romeo's whole opening act — love described as violent contradiction." },
  { term: "Panel", category: "Visual",
    definition: "One frame of a comic sequence." },
  { term: "Paradox", category: "Language",
    definition: "A contradiction that turns out to hold a truth." },
  { term: "Parentheses", category: "Grammar",
    definition: "Brackets tucking an extra thought into a sentence (like this).",
    note: "Reads as a whisper, a wink, or an afterthought." },
  { term: "Passive voice", category: "Grammar",
    definition: "The action happens to the subject — and the doer can quietly vanish.",
    note: "\"Mistakes were made.\" By whom? Exactly. That question is the analysis." },
  { term: "Peer pressure appeal", category: "Visual",
    definition: "Everyone else is already doing it, so you should too.",
    note: "WW1 posters aimed it at men watching their friends enlist without them." },
  { term: "Persona", category: "Literature",
    definition: "The constructed speaker — a mask the writer performs through.",
    note: "The voice in a Smiths song is a character, not a biography. Analyse the mask." },
  { term: "Perspective (argument)", category: "Argument",
    definition: "The position a text views an issue from." },
  { term: "Personification", category: "Language",
    definition: "Giving human qualities to something non-human." },
  { term: "Pronoun", category: "Grammar",
    definition: "I, we, you, they — small words with big allegiances.",
    note: "\"We\" recruits the reader. \"They\" builds the wall." },
  { term: "Proportion", category: "Visual",
    definition: "The relative sizes of things inside the image.",
    note: "The WeightWatchers doors say everything through proportion alone." },
  { term: "Purpose", category: "Argument",
    definition: "Why the text exists at all.",
    note: "Usually a blend — persuade, inform, provoke, sell. Name the dominant one." },
  { term: "Pun", category: "Language",
    definition: "Wordplay built on a double meaning or a sound." },
  { term: "Reader positioning", category: "Argument",
    definition: "How the text manoeuvres you into a particular viewpoint.",
    note: "The phrase that reliably lifts my analysis a level. Use it." },
  { term: "Refrain", category: "Literature",
    definition: "The line that keeps coming back, usually in songs.",
    note: "Each return should mean slightly more than the last. Track the change." },
  { term: "Register", category: "Language",
    definition: "How formal or informal the language is.",
    note: "A register drop mid-text is always deliberate. Ask why it happens there." },
  { term: "Repetition", category: "Language",
    definition: "Saying it again, on purpose.",
    note: "Name the type where possible — anaphora, refrain, motif — then the effect." },
  { term: "Rhetorical question", category: "Language",
    definition: "A question that isn't really asking.",
    note: "The answer comes pre-loaded. That's the manipulation." },
  { term: "Rule of thirds", category: "Visual",
    definition: "A composition grid — subjects sit on the lines, not dead centre." },
  { term: "Salience", category: "Visual",
    definition: "Whatever your eye hits first.",
    note: "Start the poster paragraph here. Always." },
  { term: "Scale", category: "Visual",
    definition: "Size relative to the frame or to other elements.",
    note: "Cartoonists shrink politicians for a reason." },
  { term: "Semantic field", category: "Language",
    definition: "A set of words connected by shared meaning.",
    note: "Basically interchangeable with lexical field — pick one per essay and stay consistent." },
  { term: "Semicolon", category: "Grammar",
    definition: "Links two clauses that belong together; heavier than a comma, lighter than a full stop." },
  { term: "Setting", category: "Visual",
    definition: "The place or environment a scene happens in." },
  { term: "Significance", category: "Argument",
    definition: "Why the detail matters to the whole text.",
    note: "The \"so what?\" test. Every paragraph has to survive it." },
  { term: "Simile", category: "Language",
    definition: "A comparison using like or as.",
    note: "Softer than metaphor — the hedge is built in. Sometimes the hedge is the point." },
  { term: "Slang", category: "Language",
    definition: "In-group informal language.",
    note: "Identify it and analyse it; never write in it. Checklist rule number one." },
  { term: "Slogan", category: "Visual",
    definition: "The short line engineered to be remembered." },
  { term: "Soliloquy", category: "Literature",
    definition: "A character alone on stage, thinking out loud.",
    note: "The only time drama lets us straight into someone's head." },
  { term: "Speaker", category: "Literature",
    definition: "The voice in a poem or lyric.",
    note: "Not the poet. See also: persona." },
  { term: "Speech bubble", category: "Visual",
    definition: "The container for dialogue in a cartoon.",
    note: "Shaky outline, jagged edges, sheer size — the bubble itself carries tone." },
  { term: "Stanza", category: "Literature",
    definition: "A poem's version of a paragraph.",
    note: "A stanza break is a breath, a jump cut, or a wall. Decide which." },
  { term: "Structure", category: "Argument",
    definition: "The organising shape of the whole text.",
    note: "Zoom out: what changed between the start and the end, and where's the hinge?" },
  { term: "Symbolism", category: "Language",
    definition: "A concrete thing standing in for an abstract one.",
    note: "The dissolving elephant: sand as time running out, made literal." },
  { term: "Synthesis", category: "Argument",
    definition: "Pulling separate threads together into one larger claim.",
    note: "What conclusions are actually for. Not summary — combination." },
  { term: "Syntax", category: "Grammar",
    definition: "How the sentence itself is built.",
    note: "A long winding sentence, then a short one. That snap is syntax doing tone." },
  { term: "Target audience", category: "Visual",
    definition: "Who the text is engineered to reach.",
    note: "Be specific: \"young men eligible to enlist\", not \"everyone\"." },
  { term: "Theme", category: "Literature",
    definition: "The underlying concern the text keeps circling.",
    note: "The topic is \"war\"; the theme is what the text says about war." },
  { term: "Thesis", category: "Argument",
    definition: "The essay's central argument, in one or two sentences.",
    note: "If I can't say it out loud in one breath, it isn't ready." },
  { term: "Tone", category: "Language",
    definition: "The writer's attitude toward the subject.",
    note: "Two precise adjectives beat five vague ones." },
  { term: "Transnational", category: "Oral & IO",
    definition: "Crosses borders and cultures.",
    note: "The quick test for whether a global issue is actually global." },
  { term: "Tricolon", category: "Language",
    definition: "Three parallel items in a row.",
    note: "Sounds finished, confident, quotable. Politicians can't resist it." },
  { term: "Typography", category: "Visual",
    definition: "The design of the text itself — font, size, weight, spacing.",
    note: "Bold capitals shout. Serif whispers heritage. The font is content too." },
  { term: "Understatement", category: "Language",
    definition: "Playing something down on purpose.",
    note: "Larkin's speciality. The flatness is where the sadness hides." },
  { term: "Verb", category: "Grammar",
    definition: "The action word of the sentence.",
    note: "\"Trudged\" versus \"walked\" — a precise verb is free tone." },
  { term: "Visual hierarchy", category: "Visual",
    definition: "The order the design makes you read things in." },
  { term: "Visual pun", category: "Visual",
    definition: "A joke made with images instead of words.",
    note: "The axe swapped for the golf club. One image, entire argument." },
  { term: "Volta", category: "Literature",
    definition: "The turn — the point where a poem changes direction.",
    note: "Find the volta and the structure paragraph is half written." },
  { term: "Zoom in", category: "Oral & IO",
    definition: "Close analysis of one small choice — a word, a phrase, a single image.",
    note: "One word can carry a whole paragraph if I actually unpack it." },
  { term: "Zoom out", category: "Oral & IO",
    definition: "Connecting that small choice back to the whole text or the global issue.",
    note: "The zoom-in is worthless without this step." },
  { term: "Brand identity", category: "Visual",
    definition: "The consistent personality a brand performs across everything it makes." },
  { term: "Colon", category: "Grammar",
    definition: "Introduces the payoff: a list, an explanation, an emphasis." },
  { term: "Comma", category: "Grammar",
    definition: "The light pause — the traffic control of a sentence." },
  { term: "Denotation", category: "Language",
    definition: "The flat dictionary meaning of a word.",
    note: "Only interesting when set against connotation." },
  { term: "Free verse", category: "Literature",
    definition: "Poetry with no fixed meter or rhyme scheme.",
    note: "The freedom is a choice too — say what it allows the poet to do." },
  { term: "Full stop", category: "Grammar",
    definition: "The hard stop.",
    note: "A short sentence ending in one can land like a verdict." },
  { term: "Grid layout", category: "Visual",
    definition: "Content locked into strict rows and columns." },
  { term: "Hook", category: "Argument",
    definition: "The opening line that earns the audience's attention.",
    note: "Plan mine before the oral, not during it." },
  { term: "Internal rhyme", category: "Literature",
    definition: "Rhyme happening inside the line rather than at its end." },
  { term: "Logo", category: "Visual",
    definition: "The brand's visual signature." },
  { term: "Meter", category: "Literature",
    definition: "The rhythm pattern of stressed and unstressed syllables.",
    note: "Regular meter reads as control. A broken meter says: look here." },
  { term: "Parallelism", category: "Language",
    definition: "Repeating the same grammatical shape across phrases." },
  { term: "Perspective (visual)", category: "Visual",
    definition: "The viewpoint built into the image itself.",
    note: "Who looks down, who looks up, who is level with us." },
  { term: "Question mark", category: "Grammar",
    definition: "Marks a question — real, or rhetorical." },
  { term: "Second person", category: "Grammar",
    definition: "You, your — the text reaching out of the page.",
    note: "Adverts and posters live here. It is aimed at you, personally." },
  { term: "Shot distance", category: "Visual",
    definition: "How close the subject appears in the frame.",
    note: "Close-up: intimacy or scrutiny. Long shot: context or loneliness." },
  { term: "Third person", category: "Grammar",
    definition: "He, she, they — names instead of I or you." },
  { term: "Topic sentence", category: "Argument",
    definition: "The first line of a paragraph, carrying its claim.",
    note: "Examiners read these first. Make them do the arguing." },
  { term: "White space", category: "Visual",
    definition: "The deliberate emptiness left in a design.",
    note: "Looks expensive for a reason: it says we don't need to shout." },
  { term: "Zoomorphism", category: "Language",
    definition: "Describing a person through animal traits.",
    note: "Dehumanising or liberating, depending on the animal." }
];

const glossarySearch = $("#glossarySearch");
const glossaryFilters = $("#glossaryFilters");
const glossaryList = $("#glossaryList");
const glossaryCount = $("#glossaryCount");

const sortedGlossary = [...glossaryTerms].sort((left, right) =>
  left.term.localeCompare(right.term)
);

let activeGlossaryFilter = "All";

function renderGlossaryFilters() {
  if (!glossaryFilters) {
    return;
  }

  const categories = ["All", ...new Set(sortedGlossary.map((item) => item.category))];

  glossaryFilters.innerHTML = categories
    .map(
      (category) => `
        <button
          class="filter-pill"
          type="button"
          data-filter="${category}"
          aria-pressed="${category === activeGlossaryFilter}"
        >
          ${category}
        </button>
      `
    )
    .join("");

  $$(".filter-pill", glossaryFilters).forEach((button) => {
    button.addEventListener("click", () => {
      activeGlossaryFilter = button.dataset.filter || "All";
      renderGlossaryFilters();
      renderGlossary();
    });
  });
}

function renderGlossary() {
  if (!glossaryList) {
    return;
  }

  const query = (glossarySearch?.value || "").trim().toLowerCase();
  const filtered = sortedGlossary.filter((item) => {
    const inCategory =
      activeGlossaryFilter === "All" || item.category === activeGlossaryFilter;

    const inSearch =
      !query ||
      `${item.term} ${item.category} ${item.definition} ${item.note || ""}`
        .toLowerCase()
        .includes(query);

    return inCategory && inSearch;
  });

  if (glossaryCount) {
    glossaryCount.textContent =
      filtered.length === sortedGlossary.length
        ? `All ${sortedGlossary.length} terms`
        : `${filtered.length} of ${sortedGlossary.length} terms`;
  }

  if (!filtered.length) {
    glossaryList.innerHTML = `
      <article class="empty-state">
        <h3>Nothing matches that</h3>
        <p>Try fewer letters, or flick the category filter back to All.</p>
      </article>
    `;
    return;
  }

  glossaryList.innerHTML = filtered
    .map(
      (item) => `
        <article class="term-card" data-cat="${item.category}">
          <div class="term-head">
            <h3>${item.term}</h3>
            <span class="term-category">${item.category}</span>
          </div>
          <p>${item.definition}</p>
          ${item.note ? `<p class="term-note">${item.note}</p>` : ""}
        </article>
      `
    )
    .join("");
}

if (glossarySearch) {
  glossarySearch.addEventListener("input", renderGlossary);
}

renderGlossaryFilters();
renderGlossary();

// Quiz mode: shows a definition from the current category, hides the term.
const quizButton = $("#quizButton");
const quizCard = $("#quizCard");
let lastQuizTerm = null;

function startQuiz() {
  if (!quizCard) {
    return;
  }

  const pool = sortedGlossary.filter(
    (item) => activeGlossaryFilter === "All" || item.category === activeGlossaryFilter
  );

  if (!pool.length) {
    return;
  }

  let pick = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1) {
    while (pick === lastQuizTerm) {
      pick = pool[Math.floor(Math.random() * pool.length)];
    }
  }
  lastQuizTerm = pick;

  const scopeLabel =
    activeGlossaryFilter === "All" ? "" : ` <span class="quiz-scope">(${activeGlossaryFilter})</span>`;

  quizCard.hidden = false;
  quizCard.innerHTML = `
    <p class="quiz-label">Which term is this?${scopeLabel}</p>
    <p class="quiz-definition">${pick.definition}</p>
    <div class="quiz-actions">
      <button class="quiz-reveal" type="button">Reveal</button>
      <button class="quiz-next" type="button">Another one</button>
      <button class="quiz-close" type="button">Done</button>
    </div>
  `;

  $(".quiz-reveal", quizCard).addEventListener("click", (event) => {
    event.target.disabled = true;
    $(".quiz-definition", quizCard).insertAdjacentHTML(
      "afterend",
      `<p class="quiz-answer">${pick.term}${pick.note ? ` <span class="quiz-note">— ${pick.note}</span>` : ""}</p>`
    );
  });

  $(".quiz-next", quizCard).addEventListener("click", startQuiz);
  $(".quiz-close", quizCard).addEventListener("click", () => {
    quizCard.hidden = true;
    quizCard.innerHTML = "";
  });
}

if (quizButton) {
  quizButton.addEventListener("click", startQuiz);
}

const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxCaption = $("#lightboxCaption");
const lightboxClose = $(".lightbox-close");
const lightboxPrev = $(".lightbox-prev");
const lightboxNext = $(".lightbox-next");
const galleryButtons = $$(".gallery-button");

let currentLightboxIndex = 0;
let lastLightboxTrigger = null;

function updateLightbox(index) {
  if (!galleryButtons.length || !lightboxImage || !lightboxCaption) {
    return;
  }

  currentLightboxIndex = (index + galleryButtons.length) % galleryButtons.length;
  const button = galleryButtons[currentLightboxIndex];
  const image = $("img", button);

  if (!image) {
    return;
  }

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent =
    button.dataset.caption || image.alt || "Expanded study image";
}

function openLightbox(index) {
  if (!lightbox) {
    return;
  }

  lastLightboxTrigger = document.activeElement;
  updateLightbox(index);
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");

  if (lightboxClose) {
    lightboxClose.focus();
  }
}

function closeLightbox() {
  if (!lightbox || !lightbox.classList.contains("show")) {
    return;
  }

  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");

  if (lightboxImage) {
    lightboxImage.removeAttribute("src");
  }

  if (lastLightboxTrigger instanceof HTMLElement) {
    lastLightboxTrigger.focus();
  }
}

galleryButtons.forEach((button, index) => {
  button.addEventListener("click", () => openLightbox(index));
});

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", () => updateLightbox(currentLightboxIndex - 1));
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", () => updateLightbox(currentLightboxIndex + 1));
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (!lightbox || !lightbox.classList.contains("show")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    updateLightbox(currentLightboxIndex - 1);
  }

  if (event.key === "ArrowRight") {
    updateLightbox(currentLightboxIndex + 1);
  }
});
