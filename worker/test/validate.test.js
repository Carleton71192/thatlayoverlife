import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalize,
  damerauLevenshtein,
  classifyEdit,
  checkCloudinaryUrl,
  readingTime,
} from "../src/validate.js";

test("normalize strips case, punctuation and extra whitespace", () => {
  assert.equal(normalize("  Hello,   WORLD!  "), "hello world");
  assert.equal(normalize("café’s"), "cafs".replace("fs", "fés"));
});

test("damerauLevenshtein counts a swap as one edit", () => {
  assert.equal(damerauLevenshtein("recieved", "received"), 1);
  assert.equal(damerauLevenshtein("kitten", "sitting"), 3);
  assert.equal(damerauLevenshtein("", "abc"), 3);
});

test("classifyEdit: spelling", () => {
  assert.equal(classifyEdit("We recieved the bags late.", "We received the bags late."), "spelling");
  assert.equal(classifyEdit("Recieved at last.", "Received at last."), "spelling");
});

test("classifyEdit: punctuation (missing comma)", () => {
  assert.equal(classifyEdit("However we found a bar.", "However, we found a bar."), "punctuation");
});

test("classifyEdit: capitalization", () => {
  assert.equal(classifyEdit("We flew to copenhagen.", "We flew to Copenhagen."), "capitalization");
  assert.equal(classifyEdit("copenhagen", "Copenhagen"), "capitalization");
});

test("classifyEdit: paragraph break inserted or removed", () => {
  assert.equal(
    classifyEdit("The gate changed. Then the plane did.", "The gate changed.\n\nThen the plane did."),
    "paragraph"
  );
  assert.equal(
    classifyEdit("The gate changed.\n\nThen the plane did.", "The gate changed. Then the plane did."),
    "paragraph"
  );
});

test("classifyEdit: sentence order", () => {
  assert.equal(
    classifyEdit("I missed the train. Then I found a bar.", "Then I found a bar. I missed the train."),
    "order"
  );
});

test("classifyEdit rejects a changed number", () => {
  assert.equal(classifyEdit("We waited 5 hours.", "We waited 4 hours."), null);
  assert.equal(classifyEdit("Gate B12", "Gate B13"), null);
});

test("classifyEdit rejects a changed name", () => {
  assert.equal(classifyEdit("I had dinner with Magnus last night.", "I had dinner with Max last night."), null);
  // Close enough to look like a typo, still a name in the middle of a sentence.
  assert.equal(classifyEdit("I had dinner with Magnus last night.", "I had dinner with Magnas last night."), null);
});

test("classifyEdit rejects a removed joke clause", () => {
  assert.equal(
    classifyEdit(
      "The flight was late, which is shocking for Ryanair.",
      "The flight was late."
    ),
    null
  );
});

test("classifyEdit rejects an added word", () => {
  assert.equal(classifyEdit("I had a great time.", "I had a really great time."), null);
});

test("classifyEdit rejects identical text and non-strings", () => {
  assert.equal(classifyEdit("same", "same"), null);
  assert.equal(classifyEdit("same", undefined), null);
});

test("classifyEdit rejects a word swapped for a different word", () => {
  assert.equal(classifyEdit("The bar was loud.", "The bar was quiet."), null);
});

const CLEAN =
  "https://res.cloudinary.com/idonvlow/image/upload/c_crop,w_1200,h_800/e_improve,e_auto_brightness,e_auto_color,e_auto_contrast,q_auto,f_auto,fl_keep_iptc/v1/tll/abc.jpg";

test("checkCloudinaryUrl accepts the allowlisted transformations", () => {
  assert.deepEqual(checkCloudinaryUrl(CLEAN), { ok: true });
});

test("checkCloudinaryUrl accepts a URL with no transformations", () => {
  assert.deepEqual(checkCloudinaryUrl("https://res.cloudinary.com/idonvlow/image/upload/v1/tll/abc.jpg"), { ok: true });
  assert.deepEqual(checkCloudinaryUrl("https://res.cloudinary.com/idonvlow/image/upload/tll/abc.jpg"), { ok: true });
});

test("checkCloudinaryUrl rejects generative and enhancing effects", () => {
  for (const bad of ["e_gen_fill", "e_background_removal", "e_upscale", "e_enhance", "e_gen_remove:prompt_cat"]) {
    const url = `https://res.cloudinary.com/idonvlow/image/upload/c_crop,w_1200/${bad}/v1/tll/abc.jpg`;
    const result = checkCloudinaryUrl(url);
    assert.equal(result.ok, false, bad);
    assert.ok(result.reason, bad);
  }
});

test("checkCloudinaryUrl rejects unlisted effects, other hosts and odd shapes", () => {
  assert.equal(checkCloudinaryUrl("https://res.cloudinary.com/idonvlow/image/upload/e_sepia/v1/a.jpg").ok, false);
  assert.equal(checkCloudinaryUrl("https://res.cloudinary.com/idonvlow/image/upload/c_fill,w_100/v1/a.jpg").ok, false);
  assert.equal(checkCloudinaryUrl("https://example.com/idonvlow/image/upload/v1/a.jpg").ok, false);
  assert.equal(checkCloudinaryUrl("http://res.cloudinary.com/idonvlow/image/upload/v1/a.jpg").ok, false);
  assert.equal(checkCloudinaryUrl("https://res.cloudinary.com.evil.test/idonvlow/image/upload/v1/a.jpg").ok, false);
  assert.equal(checkCloudinaryUrl("not a url").ok, false);
  // A bad component mixed in with a good one is still rejected.
  assert.equal(checkCloudinaryUrl("https://res.cloudinary.com/idonvlow/image/upload/w_100,e_gen_fill/a.jpg").ok, false);
  // Encoded tricks are decoded before checking.
  assert.equal(checkCloudinaryUrl("https://res.cloudinary.com/idonvlow/image/upload/e%5Fgen%5Ffill/v1/a.jpg").ok, false);
});

test("checkCloudinaryUrl can require an untouched original", () => {
  assert.equal(checkCloudinaryUrl(CLEAN, { allowTransformations: false }).ok, false);
  assert.equal(
    checkCloudinaryUrl("https://res.cloudinary.com/idonvlow/image/upload/v1/tll/abc.jpg", { allowTransformations: false }).ok,
    true
  );
});

test("readingTime", () => {
  assert.equal(readingTime("<p>" + "word ".repeat(441) + "</p>"), 3);
  assert.equal(readingTime(""), 1);
  assert.equal(readingTime("<p>one</p>"), 1);
  assert.equal(readingTime("word ".repeat(220)), 1);
  assert.equal(readingTime("word ".repeat(221)), 2);
});
