# Audio Files Directory Structure

## Recommended Local Audio File Organization

```
public/
├── audio/
│   ├── consonants/
│   │   ├── ก.mp3
│   │   ├── ข.mp3
│   │   ├── ค.mp3
│   │   └── ... (all consonant audio files)
│   ├── vowels/
│   │   ├── ะ.mp3
│   │   ├── า.mp3
│   │   ├── ิ.mp3
│   │   └── ... (all vowel audio files)
│   └── tone-marks/
│       ├── ่.mp3
│       ├── ้.mp3
│       ├── ๊.mp3
│       └── ... (all tone mark audio files)
```

## Audio File Naming Convention

- Use the actual Thai character as the filename
- Use MP3 format for best compatibility
- Ensure files are optimized for web (compressed but good quality)

## Implementation Steps

1. **Obtain Audio Files Legally**
   - Contact thai-alphabet.com for permission
   - Or record your own native Thai speaker
   - Or find Creative Commons Thai audio resources

2. **Update Audio Paths**
   - Your current data structure already has `audioPath` fields
   - Paths should point to `/audio/[category]/[character].mp3`

3. **Test Audio Loading**
   - The existing `useAudio` hook will automatically handle local files
   - Fallback to TTS if files are missing
   - Error handling is already implemented

## Legal Alternatives

### Option 1: Contact thai-alphabet.com
- Email them asking for educational use permission
- They might provide audio files or API access
- Mention it's for a learning app

### Option 2: Create Your Own Audio
- Record a native Thai speaker
- Use the same character set as thai-alphabet.com
- Full control over quality and licensing

### Option 3: Use Open Source Resources
- Look for Creative Commons Thai audio
- Check academic repositories
- Use Freesound.org for Thai language audio

## Next Steps

Once you have the audio files:

1. Place them in the `public/audio/` directory
2. Ensure filenames match the character IDs in your JSON
3. Test the audio playback
4. The existing system will automatically use local files over TTS

Would you like me to help you implement any specific part of this system?
