# subdelay - Subtitle Timing Shifter

A simple yet powerful command-line tool for shifting subtitle timing in .srt and .ass subtitle files.

### Features

- ⏱️ Easily adjust subtitle timing with millisecond precision
- 🎬 Support for both .srt and .ass subtitle formats
- ⚡ Fast and efficient processing
- 🛠️ Simple command-line interface
- 📦 Zero dependencies

### Installation

```
npm install -g subdelay
```

### Usage
```bash
subdelay <filename> <delay_in_ms>
```

### Parameters

- ```filename```: Path to the subtitle file (must be ```.srt``` or ```.ass``` format)
- ```delay_in_ms```: Delay in milliseconds
  - Use positive values to delay subtitles (move them later)
  - Use negative values to advance subtitles (move them earlier)

### Examples

Delay subtitles by 2 seconds (2000ms):
```bash
subdelay "movie.srt" 2000
```

Advance subtitles by 1.5 seconds (-1500ms):
```bash
subdelay "anime.ass" -1500
```

### Supported Formats

- **SubRip Text (.srt)** - One of the most common subtitle formats
- **Advanced SubStation Alpha (.ass)** - Advanced format with styling, commonly used for anime

### Notes

- The tool modifies the file in place. Create a backup of your original file if needed.
- For best results, ensure your subtitle files are properly formatted.
- Negative delays will not result in negative timestamps; the minimum timestamp is 00:00:00,000.

### Troubleshooting

**Error: Unsupported file format**
- Make sure your file has a .srt or .ass extension and is properly formatted.

**File not found**
- Check that the file path is correct and the file exists.

### License

MIT

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (```git checkout -b feature/amazing-feature```)
3. Commit your changes (```git commit -m 'Add some amazing feature'```)
4. Push to the branch (```git push origin feature/amazing-feature```)
5. Open a Pull Request

### Author

irelevant25 - [GitHub](https://github.com/irelevant25/genshin-quiz)

### Need Help?

If you encounter any issues or have questions, please [open an issue](https://github.com/irelevant25/genshin-quiz) on GitHub.
