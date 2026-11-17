"""사이트를 파일 하나(dist/kr1mtvalues.html)로 묶는다.

공개 페이지(Artifact)는 외부 이미지·스크립트를 막기 때문에
CSS·JS·데이터를 모두 HTML 안에 넣고, 위키 이미지는 내려받아 data: 주소로 바꾼다.

사용법: python3 tools/build_artifact.py
"""
import base64
import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "kr1mtvalues.html"
IMG_WIDTH = 400  # 위키 이미지 축소 폭 (용량 절약)


def fetch_data_uri(url: str) -> str:
    url = re.sub(r"/scale-to-width-down/\d+", "", url)
    if "/revision/latest" in url:
        url = url.split("/revision/latest")[0] + f"/revision/latest/scale-to-width-down/{IMG_WIDTH}"
    req = urllib.request.Request(url, headers={"User-Agent": "kr1mtvalues-build"})
    with urllib.request.urlopen(req, timeout=30) as r:
        mime = r.headers.get_content_type() or "image/png"
        data = r.read()
    return f"data:{mime};base64,{base64.b64encode(data).decode()}"


def main() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "style.css").read_text(encoding="utf-8")
    items = (ROOT / "data" / "items.js").read_text(encoding="utf-8")
    app = (ROOT / "app.js").read_text(encoding="utf-8")

    cache: dict[str, str] = {}

    def swap(m: re.Match) -> str:
        url = m.group(1)
        if url not in cache:
            try:
                cache[url] = fetch_data_uri(url)
                print("image ok:", url[:90])
            except Exception as e:  # 실패하면 분류 아이콘으로 표시된다
                print("image FAIL:", url, e)
                cache[url] = ""
        return f'image: "{cache[url]}"'

    items = re.sub(r'image: "(https?://[^"]+)"', swap, items)

    # 공개 페이지 보정: 상단 고정바가 휴대폰 상태표시줄에 가리지 않게
    css += "\n.top { top: env(safe-area-inset-top, 0px); }\nbody { background: var(--bg); }\n"

    head_extra = re.search(r"<title>.*?</title>\s*<meta name=\"description\"[^>]*>", html, re.S).group(0)
    body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
    body = re.sub(r'\s*<script src="[^"]+"></script>', "", body)

    out = (
        f"{head_extra}\n<style>\n{css}</style>\n{body.strip()}\n"
        f"<script>\n{items}\n</script>\n<script>\n{app}\n</script>\n"
    )
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(out, encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
