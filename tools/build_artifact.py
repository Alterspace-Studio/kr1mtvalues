"""사이트를 파일 하나(dist/kr1mtvalues.html)로 묶는다.

공개 페이지(Artifact)는 외부 이미지·스크립트를 막기 때문에
CSS·JS·데이터를 모두 HTML 안에 넣고, 위키 이미지와 로컬 이미지를 data: 주소로 바꾼다.

사용법: python3 tools/build_artifact.py
"""
import base64
import mimetypes
import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "kr1mtvalues.html"
IMG_WIDTH = 400  # 위키 이미지 축소 폭 (용량 절약)


def to_data_uri(data: bytes, mime: str) -> str:
    return f"data:{mime};base64,{base64.b64encode(data).decode()}"


def fetch_data_uri(url: str) -> str:
    url = re.sub(r"/scale-to-width-down/\\d+", "", url)
    if "/revision/latest" in url:
        url = url.split("/revision/latest")[0] + f"/revision/latest/scale-to-width-down/{IMG_WIDTH}"
    req = urllib.request.Request(url, headers={"User-Agent": "kr1mtvalues-build"})
    with urllib.request.urlopen(req, timeout=30) as r:
        mime = r.headers.get_content_type() or "image/png"
        data = r.read()
    return to_data_uri(data, mime)


def local_data_uri(image_path: str) -> str:
    # 저장소 루트 밖의 파일을 읽지 않도록 경로를 제한한다.
    root = ROOT.resolve()
    path = (root / image_path).resolve()
    try:
        path.relative_to(root)
    except ValueError:
        raise ValueError(f"저장소 밖의 이미지 경로: {image_path}")

    if not path.is_file():
        raise FileNotFoundError(f"이미지 파일을 찾을 수 없음: {image_path}")

    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return to_data_uri(path.read_bytes(), mime)


def main() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "style.css").read_text(encoding="utf-8")
    items = (ROOT / "data" / "items.js").read_text(encoding="utf-8")
    app = (ROOT / "app.js").read_text(encoding="utf-8")

    cache: dict[str, str] = {}

    def swap(m: re.Match) -> str:
        image_path = m.group(1)
        if not image_path:
            return m.group(0)

        if image_path not in cache:
            try:
                if image_path.startswith(("https://", "http://")):
                    cache[image_path] = fetch_data_uri(image_path)
                else:
                    cache[image_path] = local_data_uri(image_path)
                print("image ok:", image_path[:90])
            except Exception as e:  # 실패하면 분류 아이콘으로 표시된다
                print("image FAIL:", image_path, e)
                cache[image_path] = ""
        return f'image: "{cache[image_path]}"'

    # 원격 이미지뿐 아니라 images/... 형태의 저장소 내부 이미지도 내장한다.
    items = re.sub(r'image: "([^"]*)"', swap, items)

    # 공개 페이지 보정: 상단 고정바가 휴대폰 상태표시줄에 가리지 않게
    css += "\\n.top { top: env(safe-area-inset-top, 0px); }\\nbody { background: var(--bg); }\\n"

    head_match = re.search(r"<title>.*?</title>\\s*<meta name=\\"description\\"[^>]*>", html, re.S)
    body_match = re.search(r"<body>(.*)</body>", html, re.S)
    if not head_match or not body_match:
        raise ValueError("index.html에서 title/description 또는 body 영역을 찾지 못했습니다.")

    head_extra = head_match.group(0)
    body = body_match.group(1)
    body = re.sub(r'\\s*<script src="[^"]+"></script>', "", body)

    out = (
        f"{head_extra}\\n<style>\\n{css}</style>\\n{body.strip()}\\n"
        f"<script>\\n{items}\\n</script>\\n<script>\\n{app}\\n</script>\\n"
    )
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(out, encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
