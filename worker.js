export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url");
    const deep = url.searchParams.get("deep") === "1";

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8"
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    if (!target || !/^https:\/\/www\.jw\.org\/ko\//.test(target)) {
      return new Response(JSON.stringify({ error: "JW.org 한국어 URL만 허용됩니다." }), { status: 400, headers: cors });
    }

    try {
      const main = await extractPage(target);

      if (deep) {
        const limited = main.related.slice(0, 8);
        const relatedPages = [];
        for (const link of limited) {
          try {
            const page = await extractPage(link.url);
            relatedPages.push({
              url: page.url,
              title: page.title,
              blocks: page.blocks.slice(0, 20),
              verses: page.verses.slice(0, 20)
            });
          } catch (e) {
            relatedPages.push({ url: link.url, title: link.text || link.url, error: String(e.message || e) });
          }
        }
        main.relatedPages = relatedPages;
      }

      return new Response(JSON.stringify(main), { headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e.message || e) }), { status: 500, headers: cors });
    }
  }
};

async function extractPage(target) {
  const res = await fetch(target, {
    headers: {
      "User-Agent": "Mozilla/5.0 personal-study-fetcher",
      "Accept": "text/html,application/xhtml+xml"
    }
  });

  if (!res.ok) throw new Error("JW.org 요청 실패: " + res.status);

  let html = await res.text();

  html = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "");

  const title = clean(
    firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
    firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ||
    target
  );

  const blocks = [];
  const blockRegex = /<(h1|h2|h3|p|li)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = blockRegex.exec(html)) && blocks.length < 220) {
    const text = clean(m[2]);
    if (!text) continue;
    if (text.length < 2) continue;
    if (/^(공유|인쇄|다운로드|옵션|언어|로그인)$/.test(text)) continue;
    blocks.push({ type: m[1].toLowerCase().replace("li", "p"), text });
  }

  const links = [];
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  while ((m = linkRegex.exec(html)) && links.length < 500) {
    let href = decodeHtml(m[1] || "");
    let text = clean(m[2] || "");
    if (!href) continue;
    if (href.startsWith("/")) href = "https://www.jw.org" + href;
    if (!href.startsWith("https://www.jw.org/ko/")) continue;
    if (href.includes("#")) href = href.split("#")[0];
    if (!text) text = href;
    links.push({ text, url: href });
  }

  const seen = new Set();
  const related = links.filter(l => {
    if (seen.has(l.url)) return false;
    seen.add(l.url);
    if (l.url === target) return false;
    return /\/라이브러리\/|\/성경\//.test(l.url);
  }).slice(0, 40);

  const verses = Array.from(new Set(
    blocks.flatMap(b => Array.from(b.text.matchAll(/[가-힣]{1,6}\s?\d{1,3}:\d{1,3}(?:-\d{1,3})?/g)).map(x => x[0]))
  )).slice(0, 80);

  return { url: target, title, blocks, verses, related };
}

function firstMatch(s, re) {
  const m = s.match(re);
  return m ? m[1] : "";
}

function clean(s) {
  return decodeHtml(String(s || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function decodeHtml(s) {
  return String(s || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
