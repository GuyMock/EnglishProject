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

const glossaryTerms = [
  {
    term: "Active voice",
    category: "Grammar",
    definition: "A sentence structure where the subject performs the action.",
    use: "Usually sounds clearer and more direct than passive voice."
  },
  {
    term: "Adjective",
    category: "Grammar",
    definition: "A word that describes a noun.",
    use: "Useful when zooming in on precise descriptive choices."
  },
  {
    term: "Adverb",
    category: "Grammar",
    definition: "A word that modifies a verb, adjective, or another adverb.",
    use: "Can shape pace, certainty, intensity, or attitude."
  },
  {
    term: "Analysis",
    category: "Argument",
    definition: "Breaking a detail down to explain how it creates meaning.",
    use: "Moves writing beyond summary or description."
  },
  {
    term: "Alliteration",
    category: "Language",
    definition: "Repetition of initial consonant sounds in nearby words.",
    use: "Often creates emphasis, rhythm, or memorability."
  },
  {
    term: "Allusion",
    category: "Language",
    definition: "An indirect reference to another text, event, or cultural idea.",
    use: "Can add depth by borrowing meaning from elsewhere."
  },
  {
    term: "Ambiguity",
    category: "Language",
    definition: "Language that allows more than one possible meaning.",
    use: "Useful when a text feels uncertain, unstable, or layered."
  },
  {
    term: "Anaphora",
    category: "Language",
    definition: "Repetition at the start of clauses, lines, or sentences.",
    use: "Builds momentum, insistence, or emotional force."
  },
  {
    term: "Angle",
    category: "Visual",
    definition: "The viewpoint from which an image is shown.",
    use: "High and low angles can suggest vulnerability or power."
  },
  {
    term: "Antithesis",
    category: "Language",
    definition: "A deliberate contrast between two ideas in balanced wording.",
    use: "Highlights conflict, tension, or opposition."
  },
  {
    term: "Aside",
    category: "Literature",
    definition: "A brief line spoken directly to the audience while other characters do not hear it.",
    use: "Creates intimacy, irony, or secret knowledge in drama."
  },
  {
    term: "Assonance",
    category: "Language",
    definition: "Repetition of vowel sounds in nearby words.",
    use: "Can create softness, melancholy, or musicality."
  },
  {
    term: "Audience",
    category: "Argument",
    definition: "The intended reader, viewer, or listener of a text.",
    use: "Every effect should be linked back to audience response."
  },
  {
    term: "Authorial intent",
    category: "Argument",
    definition: "What the writer or creator seems to want the audience to think, feel, or question.",
    use: "Helps push analysis toward purpose, not just technique spotting."
  },
  {
    term: "Background",
    category: "Visual",
    definition: "The area behind the main subject in an image.",
    use: "Can add atmosphere, context, or contrast without becoming the focal point."
  },
  {
    term: "Blank verse",
    category: "Literature",
    definition: "Unrhymed lines written in iambic pentameter.",
    use: "Common in Shakespeare and useful when discussing dramatic rhythm."
  },
  {
    term: "Bleed",
    category: "Visual",
    definition: "When an image runs to the edge of the frame or page without a border.",
    use: "Can make a cartoon or page feel more immersive or immediate."
  },
  {
    term: "Body of work",
    category: "Oral & IO",
    definition: "A group of related non-literary texts by the same creator.",
    use: "Important in the IO because one image alone is not a full body of work."
  },
  {
    term: "Call to action",
    category: "Visual",
    definition: "Language that directly tells the audience what to do next.",
    use: "Common in adverts and propaganda posters."
  },
  {
    term: "Caption",
    category: "Visual",
    definition: "A short written line attached to an image or cartoon.",
    use: "Can anchor meaning, create irony, or deliver the punchline."
  },
  {
    term: "Caricature",
    category: "Visual",
    definition: "An exaggerated visual representation of a person.",
    use: "Often used in cartoons to mock behaviour, image, or power."
  },
  {
    term: "Caesura",
    category: "Literature",
    definition: "A pause within a line, often created by punctuation.",
    use: "Can slow rhythm, split ideas, or mimic hesitation."
  },
  {
    term: "Claim",
    category: "Argument",
    definition: "A clear interpretive point that can be supported with evidence.",
    use: "Each paragraph should begin with a claim, not a random observation."
  },
  {
    term: "Clause",
    category: "Grammar",
    definition: "A group of words containing a subject and a verb.",
    use: "Useful when analysing how sentences are built."
  },
  {
    term: "Cliche",
    category: "Language",
    definition: "An overused expression that has lost freshness.",
    use: "Usually something to avoid in academic writing."
  },
  {
    term: "Colloquial language",
    category: "Language",
    definition: "Informal language used in everyday speech.",
    use: "Can create familiarity, realism, or directness."
  },
  {
    term: "Colour palette",
    category: "Visual",
    definition: "The overall range of colours used in an image.",
    use: "Shapes mood, symbolism, and emotional tone."
  },
  {
    term: "Comparative thesis",
    category: "Argument",
    definition: "A thesis that compares how two texts treat a shared idea.",
    use: "Essential for Paper 2 because it sets up the whole argument."
  },
  {
    term: "Composition",
    category: "Visual",
    definition: "The arrangement of elements within an image.",
    use: "Helps explain focus, balance, and visual movement."
  },
  {
    term: "Connotation",
    category: "Language",
    definition: "The ideas and feelings a word suggests beyond its literal meaning.",
    use: "Great for close analysis of single-word choices."
  },
  {
    term: "Contraction",
    category: "Grammar",
    definition: "A shortened form such as can't or I'm.",
    use: "Often creates a more informal, intimate, or spoken voice."
  },
  {
    term: "Context",
    category: "Argument",
    definition: "The surrounding social, historical, cultural, or textual circumstances.",
    use: "Should support interpretation, not replace it."
  },
  {
    term: "Contrast",
    category: "Visual",
    definition: "A strong difference between elements such as colour, size, light, or ideas.",
    use: "Directs attention and sharpens meaning."
  },
  {
    term: "Critique",
    category: "Argument",
    definition: "A text's examination or challenge of an idea, value, or system.",
    use: "Useful when moving beyond simple description."
  },
  {
    term: "Crop",
    category: "Visual",
    definition: "The way an image is cut or framed.",
    use: "Can remove context, intensify focus, or create tension."
  },
  {
    term: "Dash",
    category: "Grammar",
    definition: "A punctuation mark used to interrupt, extend, or sharply shift thought.",
    use: "Often creates emphasis or sudden change in rhythm."
  },
  {
    term: "Declarative sentence",
    category: "Grammar",
    definition: "A sentence that states something directly.",
    use: "Can sound certain, blunt, or authoritative."
  },
  {
    term: "Demotic language",
    category: "Language",
    definition: "The language of ordinary everyday speech.",
    use: "Useful when a text draws on common spoken register."
  },
  {
    term: "Depth of field",
    category: "Visual",
    definition: "How much of an image appears sharp from front to back.",
    use: "A blurred background can push the eye toward one focal point."
  },
  {
    term: "Dialogue",
    category: "Literature",
    definition: "Conversation between characters.",
    use: "Can reveal conflict, power, intimacy, or social tension."
  },
  {
    term: "Diction",
    category: "Language",
    definition: "A writer's choice of words.",
    use: "One of the quickest ways to analyse tone and attitude."
  },
  {
    term: "Direct gaze",
    category: "Visual",
    definition: "When a subject looks straight at the viewer.",
    use: "Can create confrontation, connection, or pressure."
  },
  {
    term: "Dramatic irony",
    category: "Literature",
    definition: "When the audience knows something that the characters do not.",
    use: "Creates tension, humour, or tragedy in drama."
  },
  {
    term: "Ellipsis",
    category: "Grammar",
    definition: "Three dots used to mark omission or trailing thought.",
    use: "Often suggests pause, hesitation, or incompleteness."
  },
  {
    term: "Emotional blackmail",
    category: "Visual",
    definition: "Persuasion that tries to force agreement through guilt or shame.",
    use: "Very common in propaganda or moral advertising."
  },
  {
    term: "Emotive language",
    category: "Language",
    definition: "Words chosen to trigger strong feelings.",
    use: "Often aims to persuade rather than merely inform."
  },
  {
    term: "Emanata",
    category: "Visual",
    definition: "Small drawn marks showing movement, emotion, or energy in cartoons.",
    use: "Helps communicate feeling quickly without long explanation."
  },
  {
    term: "Endorsement",
    category: "Visual",
    definition: "Support from a recognised or respected figure.",
    use: "Adds authority and can pressure the audience to agree."
  },
  {
    term: "End-stopped line",
    category: "Literature",
    definition: "A poetic line that ends with clear punctuation.",
    use: "Creates closure, control, or firmness."
  },
  {
    term: "Enjambment",
    category: "Literature",
    definition: "When a sentence continues beyond the end of a line.",
    use: "Can speed the poem up or create overflow and tension."
  },
  {
    term: "Evidence",
    category: "Argument",
    definition: "The detail from the text that supports a claim.",
    use: "Evidence only works if it is followed by analysis."
  },
  {
    term: "Evaluation",
    category: "Argument",
    definition: "Judging how effective or significant a choice is.",
    use: "Useful in conclusions and oral comments on success."
  },
  {
    term: "Euphemism",
    category: "Language",
    definition: "A softer expression used in place of something harsher.",
    use: "Can hide discomfort or make a topic seem more acceptable."
  },
  {
    term: "Exclamation mark",
    category: "Grammar",
    definition: "Punctuation used to signal emphasis, force, or emotional intensity.",
    use: "Can make language feel urgent, dramatic, or exaggerated."
  },
  {
    term: "Expletive",
    category: "Language",
    definition: "A swear word or forceful outburst.",
    use: "Usually worth analysing for shock, anger, or register."
  },
  {
    term: "Field of inquiry",
    category: "Oral & IO",
    definition: "A broad conceptual area used to frame a global issue.",
    use: "Helps make the IO more precise and organised."
  },
  {
    term: "Figurative language",
    category: "Language",
    definition: "Language that goes beyond literal meaning.",
    use: "Includes devices like metaphor, simile, and personification."
  },
  {
    term: "First person",
    category: "Grammar",
    definition: "A voice using I, me, or my.",
    use: "Often feels personal, intimate, or confessional."
  },
  {
    term: "Foreshadowing",
    category: "Literature",
    definition: "A clue that hints at what will happen later.",
    use: "Builds expectation, tension, or tragic inevitability."
  },
  {
    term: "Foreground",
    category: "Visual",
    definition: "The front part of an image, closest to the viewer.",
    use: "Often contains the most immediate visual information."
  },
  {
    term: "Framing",
    category: "Visual",
    definition: "The way subjects are placed within the borders of an image.",
    use: "Shapes focus, isolation, and perspective."
  },
  {
    term: "Global issue",
    category: "Oral & IO",
    definition: "A broad issue with real significance across nations and contexts.",
    use: "The IO needs a global issue that genuinely fits both texts."
  },
  {
    term: "Graphic weight",
    category: "Visual",
    definition: "The visual heaviness created by dark lines, bold shapes, or dense detail.",
    use: "Helps explain why one part of an image stands out more than another."
  },
  {
    term: "Gutter",
    category: "Visual",
    definition: "The space between comic or cartoon panels.",
    use: "Can shape pacing and what the viewer imagines between scenes."
  },
  {
    term: "Hyperbole",
    category: "Language",
    definition: "Deliberate exaggeration for effect.",
    use: "Useful for analysing emotional intensity, humour, or irony."
  },
  {
    term: "Iambic pentameter",
    category: "Literature",
    definition: "A line of ten syllables following an unstressed-stressed pattern.",
    use: "Common in Shakespeare and useful for discussing rhythm."
  },
  {
    term: "Iconography",
    category: "Visual",
    definition: "Images or symbols that carry recognisable cultural meaning.",
    use: "Helps explain why viewers understand a symbol so quickly."
  },
  {
    term: "Idiom",
    category: "Language",
    definition: "A fixed expression whose meaning is not fully literal.",
    use: "Shows natural speech, cultural voice, or familiar phrasing."
  },
  {
    term: "Imagery",
    category: "Language",
    definition: "Descriptive language that creates sensory or mental pictures.",
    use: "Useful for poems, songs, and vivid prose."
  },
  {
    term: "Imperative verb",
    category: "Grammar",
    definition: "A command form of a verb.",
    use: "Can sound forceful, persuasive, or controlling."
  },
  {
    term: "Inference",
    category: "Argument",
    definition: "A logical conclusion drawn from evidence rather than stated directly.",
    use: "Strong analysis depends on reasonable inference, not random guessing."
  },
  {
    term: "Interrogative sentence",
    category: "Grammar",
    definition: "A sentence asked as a question.",
    use: "Can invite thought, challenge the audience, or pressure agreement."
  },
  {
    term: "Interpretation",
    category: "Argument",
    definition: "An explanation of what a detail means or suggests.",
    use: "Turns evidence into an argument."
  },
  {
    term: "Irony",
    category: "Language",
    definition: "A contrast between what seems to be said and what is really meant or shown.",
    use: "Can create humour, criticism, or discomfort."
  },
  {
    term: "Juxtaposition",
    category: "Language",
    definition: "Placing two contrasting things close together.",
    use: "Sharpens difference and often drives the main message."
  },
  {
    term: "Label",
    category: "Visual",
    definition: "Words placed directly inside an image to identify or satirise a subject.",
    use: "Common in political cartoons to make symbolism obvious."
  },
  {
    term: "Layout",
    category: "Visual",
    definition: "The overall arrangement of text and images on a page.",
    use: "Useful for explaining order, readability, and emphasis."
  },
  {
    term: "Lexical field",
    category: "Language",
    definition: "A set of words linked by a shared topic or idea.",
    use: "Shows how repeated vocabulary creates a pattern."
  },
  {
    term: "Line of argument",
    category: "Argument",
    definition: "The logical progression of an essay or oral response.",
    use: "Keeps ideas connected instead of sounding random."
  },
  {
    term: "Message",
    category: "Argument",
    definition: "The main idea or claim a text communicates.",
    use: "Every paragraph should link back to it."
  },
  {
    term: "Metaphor",
    category: "Language",
    definition: "A comparison made by saying one thing is another.",
    use: "Can condense complex emotion or thought into one image."
  },
  {
    term: "Minor sentence",
    category: "Grammar",
    definition: "A very short sentence or sentence fragment used for effect.",
    use: "Can feel punchy, abrupt, or dramatic."
  },
  {
    term: "Modal verb",
    category: "Grammar",
    definition: "A verb such as might, must, should, or could that shows degree or certainty.",
    use: "Useful for analysing pressure, obligation, or possibility."
  },
  {
    term: "Monologue",
    category: "Literature",
    definition: "A long speech by one character.",
    use: "Can reveal personality, conflict, or emotional state."
  },
  {
    term: "Mood",
    category: "Literature",
    definition: "The feeling created in the audience.",
    use: "Different from tone, which belongs to the speaker or writer."
  },
  {
    term: "Motif",
    category: "Language",
    definition: "A recurring image, phrase, or idea in a text.",
    use: "Often helps unify a theme across the whole work."
  },
  {
    term: "Narrator",
    category: "Literature",
    definition: "The voice that tells a story.",
    use: "Useful when discussing viewpoint, reliability, or distance."
  },
  {
    term: "Negative space",
    category: "Visual",
    definition: "The empty area around the main subject.",
    use: "Can create focus, clarity, or emotional isolation."
  },
  {
    term: "Noun phrase",
    category: "Grammar",
    definition: "A group of words built around a noun.",
    use: "Helps when analysing compressed description or emphasis."
  },
  {
    term: "Onomatopoeia",
    category: "Language",
    definition: "A word that imitates a sound.",
    use: "Useful when sound itself becomes part of meaning."
  },
  {
    term: "Oxymoron",
    category: "Language",
    definition: "Two contradictory words placed together.",
    use: "Highlights tension, conflict, or emotional complexity."
  },
  {
    term: "Panel",
    category: "Visual",
    definition: "A single framed image in a comic or cartoon sequence.",
    use: "Panels control pacing, progression, and contrast."
  },
  {
    term: "Paradox",
    category: "Language",
    definition: "An apparently contradictory statement that reveals a truth.",
    use: "Useful for complex ideas that resist simple logic."
  },
  {
    term: "Parentheses",
    category: "Grammar",
    definition: "Brackets used to insert extra material into a sentence.",
    use: "Can create side comments, qualification, or a shift in tone."
  },
  {
    term: "Passive voice",
    category: "Grammar",
    definition: "A sentence structure where the action is done to the subject.",
    use: "Can hide responsibility or create distance."
  },
  {
    term: "Peer pressure appeal",
    category: "Visual",
    definition: "Persuasion based on the idea that everyone else is already involved.",
    use: "Common in propaganda and social advertising."
  },
  {
    term: "Persona",
    category: "Literature",
    definition: "A speaking voice or character created by the writer.",
    use: "Important because the speaker is not always the writer."
  },
  {
    term: "Perspective (argument)",
    category: "Argument",
    definition: "The viewpoint from which a person or issue is presented.",
    use: "Helpful when comparing how texts frame the same concern differently."
  },
  {
    term: "Personification",
    category: "Language",
    definition: "Giving human qualities to something non-human.",
    use: "Can make an abstract idea feel vivid or alive."
  },
  {
    term: "Pronoun",
    category: "Grammar",
    definition: "A word such as I, we, you, he, she, or they used in place of a noun.",
    use: "Pronoun choices can shape intimacy, distance, or blame."
  },
  {
    term: "Proportion",
    category: "Visual",
    definition: "The size relationship between parts of an image.",
    use: "Exaggerated proportion can create humour or criticism."
  },
  {
    term: "Purpose",
    category: "Argument",
    definition: "The reason a text was created.",
    use: "Often connects to persuading, informing, challenging, or entertaining."
  },
  {
    term: "Pun",
    category: "Language",
    definition: "A play on words based on double meaning or sound similarity.",
    use: "Can make a message memorable or humorous."
  },
  {
    term: "Reader positioning",
    category: "Argument",
    definition: "The way a text guides the audience toward a particular response.",
    use: "A strong phrase for higher-level analysis."
  },
  {
    term: "Refrain",
    category: "Literature",
    definition: "A repeated line or phrase, often in songs and poems.",
    use: "Creates emphasis, structure, and emotional return."
  },
  {
    term: "Register",
    category: "Language",
    definition: "The level of formality or informality in language.",
    use: "Useful when discussing slang, demotic voice, or official tone."
  },
  {
    term: "Repetition",
    category: "Language",
    definition: "Deliberate reuse of words, sounds, structures, or ideas.",
    use: "Often signals importance or emotional pressure."
  },
  {
    term: "Rhetorical question",
    category: "Language",
    definition: "A question asked for effect rather than a real answer.",
    use: "Can challenge, provoke, or pressure the audience."
  },
  {
    term: "Rule of thirds",
    category: "Visual",
    definition: "A composition guide that divides an image into a three-by-three grid.",
    use: "Helps explain why a picture feels balanced or carefully focused."
  },
  {
    term: "Salience",
    category: "Visual",
    definition: "The feature that stands out most strongly in an image.",
    use: "Useful for explaining what the viewer notices first."
  },
  {
    term: "Scale",
    category: "Visual",
    definition: "The size of elements in relation to each other or to the frame.",
    use: "Can suggest importance, pressure, or insignificance."
  },
  {
    term: "Semantic field",
    category: "Language",
    definition: "A set of words connected by shared meaning.",
    use: "Like lexical field, it helps track patterns of vocabulary."
  },
  {
    term: "Semicolon",
    category: "Grammar",
    definition: "A punctuation mark linking closely related clauses.",
    use: "Can create balance, tension, or controlled pacing."
  },
  {
    term: "Setting",
    category: "Visual",
    definition: "The place or environment in which a scene occurs.",
    use: "Often helps reveal context, mood, or social message."
  },
  {
    term: "Significance",
    category: "Argument",
    definition: "Why a detail or idea matters in the wider text.",
    use: "Pushes analysis from observation to importance."
  },
  {
    term: "Simile",
    category: "Language",
    definition: "A comparison using like or as.",
    use: "Can make an abstract feeling more concrete."
  },
  {
    term: "Slang",
    category: "Language",
    definition: "Highly informal language linked to a specific group or setting.",
    use: "Usually better to identify it than to imitate it in formal analysis."
  },
  {
    term: "Slogan",
    category: "Visual",
    definition: "A short memorable phrase used to sell or persuade.",
    use: "Often carries the main message of an advert or poster."
  },
  {
    term: "Soliloquy",
    category: "Literature",
    definition: "A speech in which a character speaks thoughts aloud while alone.",
    use: "Reveals inner conflict directly to the audience."
  },
  {
    term: "Speaker",
    category: "Literature",
    definition: "The voice speaking in a poem or lyric.",
    use: "Not always the same as the writer."
  },
  {
    term: "Speech bubble",
    category: "Visual",
    definition: "A graphic shape containing spoken dialogue in a cartoon or comic.",
    use: "Helps show tone, pace, and the relationship between text and image."
  },
  {
    term: "Stanza",
    category: "Literature",
    definition: "A grouped section of lines in a poem.",
    use: "Useful when discussing structure, shifts, and pacing."
  },
  {
    term: "Structure",
    category: "Argument",
    definition: "The way a text is organised overall.",
    use: "Can refer to stanza order, paragraph order, narrative order, or sequence."
  },
  {
    term: "Symbolism",
    category: "Language",
    definition: "When an object, colour, image, or detail represents a larger idea.",
    use: "Useful in both literature and visual analysis."
  },
  {
    term: "Synthesis",
    category: "Argument",
    definition: "Bringing ideas together to show how they connect.",
    use: "Important in conclusions and comparative writing."
  },
  {
    term: "Syntax",
    category: "Grammar",
    definition: "The arrangement of words and phrases in a sentence.",
    use: "Helps explain pace, tension, and emphasis."
  },
  {
    term: "Target audience",
    category: "Visual",
    definition: "The group a text is mainly aimed at.",
    use: "Essential for adverts, posters, and speeches."
  },
  {
    term: "Theme",
    category: "Literature",
    definition: "The central idea or concern running through a text.",
    use: "Different from topic because it suggests a deeper message."
  },
  {
    term: "Thesis",
    category: "Argument",
    definition: "The main argument of an essay or oral response.",
    use: "A good thesis is clear, arguable, and specific."
  },
  {
    term: "Tone",
    category: "Language",
    definition: "The attitude expressed by the speaker, writer, or creator.",
    use: "Can be tender, bitter, playful, accusatory, or many other things."
  },
  {
    term: "Transnational",
    category: "Oral & IO",
    definition: "Relevant across more than one country or culture.",
    use: "A useful test for whether a global issue is broad enough."
  },
  {
    term: "Tricolon",
    category: "Language",
    definition: "A pattern of three parallel words, phrases, or clauses.",
    use: "Often sounds complete, persuasive, or memorable."
  },
  {
    term: "Typography",
    category: "Visual",
    definition: "The visual styling of written text, including font, size, and spacing.",
    use: "Important in poster, advert, and magazine analysis."
  },
  {
    term: "Understatement",
    category: "Language",
    definition: "Deliberately presenting something as smaller or less intense than it is.",
    use: "Can create irony, restraint, or dark humour."
  },
  {
    term: "Verb",
    category: "Grammar",
    definition: "A word that expresses action, being, or state.",
    use: "Precise verb choice often reveals tone and energy."
  },
  {
    term: "Visual hierarchy",
    category: "Visual",
    definition: "The order in which the eye is guided through a layout.",
    use: "Useful when analysing posters, websites, and adverts."
  },
  {
    term: "Visual pun",
    category: "Visual",
    definition: "A joke or double meaning created through imagery.",
    use: "Common in advertising because it makes the message stick."
  },
  {
    term: "Volta",
    category: "Literature",
    definition: "A turn or shift in thought, tone, or argument within a poem.",
    use: "Important when a text changes direction."
  },
  {
    term: "Zoom in",
    category: "Oral & IO",
    definition: "Close analysis of a small detail such as a word, phrase, or image.",
    use: "Helps prove the argument with precision."
  },
  {
    term: "Zoom out",
    category: "Oral & IO",
    definition: "Stepping back to connect a detail to the whole text or wider issue.",
    use: "Prevents analysis from becoming too narrow."
  },
  {
    term: "Brand identity",
    category: "Visual",
    definition: "The recognisable personality or image a brand creates.",
    use: "Useful when analysing consistent colour, tone, and style in adverts."
  },
  {
    term: "Colon",
    category: "Grammar",
    definition: "A punctuation mark used to introduce explanation, list, or emphasis.",
    use: "Can make writing feel structured and deliberate."
  },
  {
    term: "Comma",
    category: "Grammar",
    definition: "A punctuation mark used for pause, separation, or rhythm.",
    use: "Useful when discussing pace and flow."
  },
  {
    term: "Denotation",
    category: "Language",
    definition: "The literal dictionary meaning of a word.",
    use: "Helpful when contrasting literal meaning with connotation."
  },
  {
    term: "Free verse",
    category: "Literature",
    definition: "Poetry without a fixed regular meter or rhyme scheme.",
    use: "Can create freedom, unpredictability, or natural speech."
  },
  {
    term: "Full stop",
    category: "Grammar",
    definition: "Punctuation marking the end of a complete sentence.",
    use: "Short full-stop sentences can feel abrupt or forceful."
  },
  {
    term: "Grid layout",
    category: "Visual",
    definition: "A structured arrangement based on columns and rows.",
    use: "Can make a design feel organised, controlled, or mechanical."
  },
  {
    term: "Hook",
    category: "Argument",
    definition: "An opening line designed to catch interest quickly.",
    use: "Useful in speeches and oral introductions."
  },
  {
    term: "Internal rhyme",
    category: "Literature",
    definition: "Rhyme occurring within a single line rather than at line endings.",
    use: "Can add musicality without obvious end rhyme."
  },
  {
    term: "Logo",
    category: "Visual",
    definition: "A visual mark used to identify a brand or organisation.",
    use: "Can carry authority, familiarity, and trust."
  },
  {
    term: "Meter",
    category: "Literature",
    definition: "The patterned rhythm of stressed and unstressed syllables.",
    use: "Helps explain sound, movement, and control in poetry."
  },
  {
    term: "Parallelism",
    category: "Language",
    definition: "Using similar grammatical structures in a repeated pattern.",
    use: "Creates balance, rhythm, and persuasive force."
  },
  {
    term: "Perspective (visual)",
    category: "Visual",
    definition: "The visual or conceptual point of view built into an image.",
    use: "Useful when discussing who has power or distance in a frame."
  },
  {
    term: "Question mark",
    category: "Grammar",
    definition: "Punctuation used to mark a direct question.",
    use: "Can signal uncertainty, challenge, or persuasion."
  },
  {
    term: "Second person",
    category: "Grammar",
    definition: "A voice using you and your.",
    use: "Often feels direct and can pull the audience into the text."
  },
  {
    term: "Shot distance",
    category: "Visual",
    definition: "How close or far the subject appears in the frame.",
    use: "Close shots can intensify intimacy while distant shots create detachment."
  },
  {
    term: "Third person",
    category: "Grammar",
    definition: "A voice using he, she, they, or names instead of I or you.",
    use: "Can create distance, objectivity, or broader scope."
  },
  {
    term: "Topic sentence",
    category: "Argument",
    definition: "The opening sentence of a paragraph that states its main claim.",
    use: "Keeps paragraphs focused and clearly structured."
  },
  {
    term: "White space",
    category: "Visual",
    definition: "Empty design space left around content.",
    use: "Can create elegance, clarity, and stronger emphasis."
  },
  {
    term: "Zoomorphism",
    category: "Language",
    definition: "Describing a person with animal-like qualities.",
    use: "Can reduce, mock, or intensify a character's portrayal."
  }
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
      `${item.term} ${item.category} ${item.definition} ${item.use}`
        .toLowerCase()
        .includes(query);

    return inCategory && inSearch;
  });

  if (glossaryCount) {
    glossaryCount.textContent = `${filtered.length} of ${sortedGlossary.length}`;
  }

  if (!filtered.length) {
    glossaryList.innerHTML = `
      <article class="empty-state">
        <h3>No matching terms</h3>
        <p>Try a broader keyword or switch the category filter back to All.</p>
      </article>
    `;
    return;
  }

  glossaryList.innerHTML = filtered
    .map(
      (item) => `
        <article class="term-card">
          <div class="term-head">
            <h3>${item.term}</h3>
            <span class="term-category">${item.category}</span>
          </div>
          <p>${item.definition}</p>
          <p><strong>Use:</strong> ${item.use}</p>
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
