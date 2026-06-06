from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_LOGOS = (
    (ROOT / "public" / "logo.png", ROOT / "public" / "logo-transparent.png"),
    (
        ROOT / "public" / "ChatGPT Image Jun 6, 2026, 11_42_16 PM (2).png",
        ROOT / "public" / "logo-wordmark-transparent.png",
    ),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Remove printed checkerboard/white background from generated logo PNGs."
    )
    parser.add_argument(
        "--input",
        type=Path,
        help="Single input PNG. If omitted, process the default icon and wordmark logos.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Output PNG for --input. Required when --input is used.",
    )
    parser.add_argument(
        "--min-brightness",
        type=int,
        default=178,
        help="Minimum RGB channel value for background candidates. Default: 178.",
    )
    parser.add_argument(
        "--max-channel-diff",
        type=int,
        default=52,
        help="Maximum RGB channel difference for neutral checkerboard pixels. Default: 52.",
    )
    return parser.parse_args()


def is_background_candidate(pixel: tuple[int, int, int, int], min_brightness: int, max_channel_diff: int) -> bool:
    red, green, blue, alpha = pixel
    if alpha == 0:
        return True

    channels = (red, green, blue)
    return min(channels) >= min_brightness and (max(channels) - min(channels)) <= max_channel_diff


def edge_points(width: int, height: int):
    for x in range(width):
        yield x, 0
        yield x, height - 1
    for y in range(1, height - 1):
        yield 0, y
        yield width - 1, y


def remove_edge_connected_background(
    input_path: Path,
    output_path: Path,
    min_brightness: int,
    max_channel_diff: int,
) -> None:
    image = Image.open(input_path).convert("RGBA")
    pixels = image.load()
    width, height = image.size

    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    for point in edge_points(width, height):
        x, y = point
        if is_background_candidate(pixels[x, y], min_brightness, max_channel_diff):
            queue.append(point)
            visited.add(point)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or ny < 0 or nx >= width or ny >= height or (nx, ny) in visited:
                continue
            if is_background_candidate(pixels[nx, ny], min_brightness, max_channel_diff):
                visited.add((nx, ny))
                queue.append((nx, ny))

    for x, y in visited:
        red, green, blue, _alpha = pixels[x, y]
        pixels[x, y] = (red, green, blue, 0)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path)
    print(f"Removed background: {input_path} -> {output_path}")


def main() -> int:
    args = parse_args()

    if args.input and not args.output:
        raise SystemExit("--output is required when --input is used.")

    jobs = ((args.input, args.output),) if args.input else DEFAULT_LOGOS

    for input_path, output_path in jobs:
        if not input_path.exists():
            print(f"Skip missing file: {input_path}")
            continue
        remove_edge_connected_background(
            input_path.resolve(),
            output_path.resolve(),
            args.min_brightness,
            args.max_channel_diff,
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
