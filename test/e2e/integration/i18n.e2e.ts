import * as en from "../../../src/locales/en/translations.json";
import * as de from "../../../src/locales/de/translations.json";

interface Spec {
  name: string;
  suts: Array<{ selector: string, expected?: string, expectedDe?: string }>;
  isHtmlContent?: boolean;
}
describe('I18N', () => {
  const changeCurrentLocaleToDe = () => { cy.get("#locale-changer-de").click(); };

  const assertContent = (selector: string, expected: string, isHtmlContent: boolean | undefined = false) => {
    cy.get(selector).should(isHtmlContent ? "have.html" : "have.text", expected);
  };

  beforeEach(() => {
    cy.visit('/');
  });

  const dispatchedOn = new Date(2020, 1, 10, 5, 15).toString(), deliveredOn = new Date(2021, 1, 10, 5, 15).toString(),
    enDeliveredText = en.status_delivered.replace("{{date}}", deliveredOn),
    deDeliveredText = de.status_delivered.replace("{{date}}", deliveredOn);

  const enSpecificTests: Spec[] = [
    {
      name: 'should work for attribute translation',
      suts: [{ selector: `#i18n-attr[title="${en.simple.attr}"]`, expected: "attribute test" }]
    },
    {
      name: 'should work for semicolon delimited multiple attributes',
      suts: [{ selector: `#i18n-multiple-attr[title="${en.simple.attr}"]`, expected: en.simple.text }]
    },
    {
      name: 'should work when same key is used for multiple attributes',
      suts: [{ selector: `#i18n-multiple-attr-same-key[title="${en.simple.attr}"][data-foo="${en.simple.attr}"]`, expected: en.simple.text }]
    },
  ];

  const deSpecificTests: Spec[] = [
    {
      name: 'should work for attribute translation',
      suts: [{ selector: `#i18n-attr[title="${de.simple.attr}"]`, expectedDe: "attribute test" }]
    },
    {
      name: 'should work for semicolon delimited multiple attributes',
      suts: [{ selector: `#i18n-multiple-attr[title="${de.simple.attr}"]`, expectedDe: de.simple.text }]
    },
    {
      name: 'should work when same key is used for multiple attributes',
      suts: [{ selector: `#i18n-multiple-attr-same-key[title="${de.simple.attr}"][data-foo="${de.simple.attr}"]`, expectedDe: de.simple.text }]
    },
  ];
  const tests: Spec[] = [
    {
      name: 'should work for simple text-content',
      suts: [{ selector: `#i18n-simple`, expected: en.simple.text, expectedDe: de.simple.text }]
    },
    {
      name: 'should work for nested translations',
      suts: [{ selector: `#i18n-nested`, expected: `${en.simple.text} ${en.simple.attr}`, expectedDe: `${de.simple.text} ${de.simple.attr}` }]
    },
    {
      name: 'should work for interpolation',
      suts: [
        { selector: `#i18n-interpolation`, expected: enDeliveredText, expectedDe: deDeliveredText },
        { selector: `#i18n-interpolation-custom`, expected: enDeliveredText, expectedDe: deDeliveredText },
        { selector: `#i18n-interpolation-es6`, expected: enDeliveredText, expectedDe: deDeliveredText },
      ]
    },
    {
      name: 'should work for context specific translation',
      suts: [
        { selector: `#i18n-ctx`, expected: en.status, expectedDe: de.status },
        {
          selector: `#i18n-ctx-dispatched`,
          expected: en.status_dispatched.replace("{{date}}", dispatchedOn),
          expectedDe: de.status_dispatched.replace("{{date}}", dispatchedOn),
        },
        { selector: `#i18n-ctx-delivered`, expected: enDeliveredText, expectedDe: deDeliveredText, },
      ]
    },
    {
      name: 'should work for pluralization',
      suts: [
        {
          selector: `#i18n-items-plural-0`,
          expected: en.itemWithCount_plural.replace("{{count}}", "0"),
          expectedDe: de.itemWithCount_plural.replace("{{count}}", "0")
        },
        {
          selector: `#i18n-items-plural-1`,
          expected: en.itemWithCount.replace("{{count}}", "1"),
          expectedDe: de.itemWithCount.replace("{{count}}", "1"),
        },
        {
          selector: `#i18n-items-plural-10`,
          expected: en.itemWithCount_plural.replace("{{count}}", "10"),
          expectedDe: de.itemWithCount_plural.replace("{{count}}", "10"),
        },
      ]
    },
    {
      name: 'should work for interval processing and nesting',
      suts: [
        { selector: `#i18n-interval-0`, expected: "0 items", expectedDe: "0 Artikel" },
        { selector: `#i18n-interval-1`, expected: "1 item", expectedDe: "1 Artikel" },
        { selector: `#i18n-interval-2`, expected: "2 items", expectedDe: "2 Artikel" },
        { selector: `#i18n-interval-3`, expected: "3 items", expectedDe: "3 Artikel" },
        { selector: `#i18n-interval-6`, expected: "6 items", expectedDe: "6 Artikel" },
        { selector: `#i18n-interval-7`, expected: "a lot of items", expectedDe: "viele Artikel" },
        { selector: `#i18n-interval-10`, expected: "a lot of items", expectedDe: "viele Artikel" },
      ]
    },
    {
      name: 'should work with html content', isHtmlContent: true,
      suts: [{ selector: `#i18n-html`, expected: en.html, expectedDe: de.html },]
    },
    {
      name: 'should work with prepend and append',
      suts: [{ selector: `#i18n-prepend-append`, expected: `${en.pretest}Blue${en["post-test"]}`, expectedDe: `${de.pretest}Blue${de["post-test"]}` },]
    },
    {
      name: 'should work with "t" value converter, but does not update the value on locale change as it is non-signalable',
      suts: [{ selector: `#i18n-t-vc`, expected: " 10 items ", expectedDe: " 10 items " },]
    },
    {
      name: 'should work with "t" binding behavior',
      suts: [{ selector: `#i18n-t-bb`, expected: " 100 items ", expectedDe: " 100 Artikel " },]
    },
    {
      name: 'should work with "nf" value converter',
      suts: [{ selector: `#i18n-nf-vc`, expected: " 123,456,789.12 ", expectedDe: " 123.456.789,12 " },]
    },
    {
      name: 'should work with "nf" binding behavior',
      suts: [{ selector: `#i18n-nf-bb`, expected: " 123.456.789,12 ", expectedDe: " 123.456.789,12 " },]
    },
    {
      name: 'should work with "nf" value converter for currency',
      suts: [{ selector: `#i18n-nf-vc-cur`, expected: " 123.456.789,12\u{00a0}€ ", expectedDe: " 123.456.789,12\u{00a0}€ " },]
    },
    {
      name: 'should work with "nf" binding behavior for currency',
      suts: [{ selector: `#i18n-nf-bb-cur`, expected: " $123,456,789.12 ", expectedDe: " 123.456.789,12\u{00a0}$ " },]
    },
    {
      name: 'should work with "df" value converter',
      suts: [{ selector: `#i18n-df-vc`, expected: " 2/10/2020 ", expectedDe: " 10.2.2020 " },]
    },
    {
      name: 'should work with "df" binding behavior',
      suts: [{ selector: `#i18n-df-bb`, expected: " 10.2.2020 ", expectedDe: " 10.2.2020 " },]
    },
    {
      name: 'should work with "rt" value converter',
      suts: [{ selector: `#i18n-rt-vc`, expected: " 2 hours ago ", expectedDe: " 2 hours ago " },]
    },
    {
      name: 'should work with "rt" binding behavior',
      suts: [{ selector: `#i18n-rt-bb`, expected: " 2 hours ago ", expectedDe: " vor 2 Stunden " },]
    },
  ]

  describe("translates via HTML that", () => {
    for (const { name, suts, isHtmlContent } of [...tests, ...enSpecificTests]) {
      it(name, () => {
        for (const sut of suts) {
          assertContent(sut.selector, sut.expected as string, isHtmlContent);
        }
      });
    }
    it("reacts to 'aurelia-relativetime-signal' signal for relative time binding behavior", () => {
      cy.get("#rt-changer").click();
      // rt VC does not react to the signal, thus the content should stay same
      assertContent("#i18n-rt-vc", " 2 hours ago ");
      assertContent("#i18n-rt-bb", " 1 year ago ");
    });
  });


  describe("updates translation on locale change that", () => {

    beforeEach(() => { changeCurrentLocaleToDe(); });

    for (const { name, suts, isHtmlContent } of [...tests, ...deSpecificTests]) {
      it(name, () => {
        for (const sut of suts) {
          assertContent(sut.selector, sut.expectedDe as string, isHtmlContent);
        }
      });
    }
  });

  describe("facilitates translation via code", () => {
    const tests = [
      {
        name: "simple",
        suts: [{ selector: "#i18n-code-simple", expected: "simple text" }]
      },
      {
        name: "context-based",
        suts: [{ selector: "#i18n-code-context", expected: `dispatched on ${dispatchedOn}` }]
      },
      {
        name: "plural",
        suts: [{ selector: "#i18n-code-plural", expected: "10 items" }]
      },
      {
        name: "interval",
        suts: [{ selector: "#i18n-code-interval", expected: "a lot of items" }]
      },
      {
        name: "nf",
        suts: [{ selector: "#i18n-code-num", expected: "123,456,789" }]
      },
      ...["simple", "locale", "currency", "text", "minus"].map((part) => (
        {
          name: `uf - ${part}`,
          suts: [{ selector: `#i18n-code-num-uf-${part}`, expected: part === "minus" ? "-123456789.12" : "123456789.12" }]
        })),
      {
        name: "df",
        suts: [{ selector: "#i18n-code-date", expected: "2/10/2021" }]
      },
      {
        name: "relative time",
        suts: [{ selector: "#i18n-code-rtime", expected: "2 hours ago" }]
      },
    ];
    for (const { name, suts } of tests) {
      it(name, () => {
        for (const sut of suts) {
          assertContent(sut.selector, sut.expected);
        }
      });
    }
  });

  it("sets the src attribute of img elements by default", () => {
    cy.get("#i18n-img").should("have.attr", "src", en.imgPath);
    changeCurrentLocaleToDe();
    cy.get("#i18n-img").should("have.attr", "src", de.imgPath);
  });
});
