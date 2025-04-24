
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  genre: string;
}

interface StoryGeneratorProps {
  song: Song;
}

export function StoryGenerator({ song }: StoryGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState<string | null>(null);

  const generateStory = () => {
    setIsLoading(true);
    
    // Mock story generation (would use AI API in real implementation)
    setTimeout(() => {
      const storyTemplates = [
        `✨ **The Enchanted Melody** ✨\n\nIn a world where music shaped reality, ${song.title} became more than just a song. It was a key to another dimension. 🌌\n\nLuna, a quiet girl with kaleidoscope eyes, discovered the track by accident while exploring her grandmother's vinyl collection. As ${song.artist}'s voice filled her room, the walls began to shimmer. 🎵✨\n\nBefore she knew it, Luna was transported to Harmonicia, a land where musical notes formed the very fabric of existence. Here, she met Cadence, a rebel fighting against the Dissonants - creatures who sought to bring silence to their world.\n\n"Your world's music gives us strength," Cadence explained, his eyes reflecting the colorful notes that floated around them. "But ${song.title} has special power here."\n\nLuna learned that each time the song played in her world, it reinforced the barriers protecting Harmonicia from the Dissonants. The genre of ${song.genre} was particularly potent, creating waves of energy that the inhabitants could harness.\n\n"But the connection is weakening," Cadence warned. "Someone in your world is trying to silence the music."\n\nLuna returned home determined to find out who was threatening the musical gateway. She discovered her uncle, a failed musician, had developed technology to absorb musical frequencies. Bitter and jealous, he didn't realize he was endangering an entire world.\n\n🎭 With cleverness and courage, Luna sabotaged his invention during a thunderstorm. As lightning struck, she played ${song.title} at full volume, creating a feedback loop that not only destroyed the silencing device but strengthened the connection between worlds. 🌩️\n\nFrom then on, Luna became Harmonicia's guardian, playing ${song.artist}'s song daily, watching her bedroom wall shimmer with grateful colors from another dimension. Sometimes, if she listened closely, she could hear Cadence's harmonies joining in. 🌈🎶\n\nAnd whenever anyone asked why that particular song meant so much to her, Luna would just smile and say, "Music connects worlds in ways we never imagine." ✨`,
        
        `🌙 **Midnight Resonance** 🌙\n\nThe first time Marcus heard ${song.title}, he was sitting in a nearly empty subway car at 2 AM. The song leaked from a stranger's headphones across from him—a tall figure in a peculiar silver jacket that seemed to catch light that wasn't there. 🚇\n\nMarcus found himself humming the melody for days afterward. It wove itself into his dreams, where he walked through doors that hadn't existed before. In these dreams, the music led him through a neon-lit city where the buildings pulsed to the rhythm of ${song.artist}'s creation. 💫\n\nOne evening, while walking home from his dead-end job, Marcus spotted a familiar silver jacket disappearing around a corner. Following on impulse, he found himself at an unmarked door illuminated by a single purple light. The bouncer's eyes widened when Marcus hummed the melody from ${song.title}.\n\n"You've been chosen," the bouncer said, stepping aside. "Welcome to The Frequency."\n\nInside was a club unlike any other. The walls shifted with colors that matched the ${song.genre} beats, and the dancers moved in perfect synchronization. At the center stood the stranger from the subway, now revealed as Elara, the club's owner and something more than human. ✨\n\n"Every decade, a piece of music opens the gate between dimensions," Elara explained over drinks that glowed and changed flavor with the music. "${song.title} is this decade's key. Those who resonate with it can see our world."\n\nMarcus learned that The Frequency existed as a nexus point between realities. The patrons were travelers, some human, some decidedly not, all gathered because they were drawn to the power of music that transcended dimensional barriers. 🌌🎵\n\nElara offered Marcus a choice: return to his mundane life or become a "Resonator"—someone who could use the song's vibrations to help travelers find their way across dimensions.\n\n"Not everyone who hears ${song.title} can feel its true power," she said, her eyes shifting like auroras. "You're special, Marcus."\n\n🎭 As dawn approached, Marcus made his decision. Taking a silver pendant shaped like a sound wave, he accepted his new role. Now, he rides the subway each night, playing ${song.artist}'s masterpiece just loudly enough for the right ears to hear, watching for that spark of recognition in a stranger's eyes that means they too can feel the music's magic. 🌃\n\nAnd somewhere between midnight and morning, if you're on the right train and your heart is open to the possibilities that exist beyond ordinary perception, you might hear the melody too. But be warned—once you truly hear ${song.title}, your world will never be the same again. 🎶✨`,
        
        `🔮 **Reverberations of Time** 🔮\n\n1987: Cassette tapes and neon lights. Seventeen-year-old Sophia found the tape unlabeled, tucked between dusty vinyl records in her recently departed grandmother's attic. When she played it, ${song.title} filled the room. It was impossible—the song wasn't released until decades later, yet here it was, recorded on a cassette that showed signs of age. 📼\n\n2023: Headphones and digital playlists. When record producer Eli first heard ${song.artist}'s demo of ${song.title}, something tugged at his memory. This wasn't just another ${song.genre} track; it was hauntingly familiar, though he knew he'd never heard it before. 🎵\n\nWhat neither knew was that the song existed in a temporal loop, traveling backward and forward through time, connecting lives across decades like a musical Möbius strip. 🌀\n\nSophia became obsessed with the mysterious song, writing down its lyrics, learning every note. Without understanding why, she began creating music of her own, infusing it with elements from the track that shouldn't exist yet. Her compositions never made it big, but they influenced local musicians, one of whom would later become Eli's father. 🎸\n\nEli, meanwhile, had recurring dreams of a girl with wild hair and determined eyes sitting in an attic surrounded by instruments he now considered vintage. Every morning after these dreams, he'd make subtle changes to ${song.title}'s arrangement, instinctively knowing they were right. 💭\n\nThe truth unraveled when Eli found his late father's journal, detailing a young woman from the 80s whose experimental music shaped his own. Included was a faded photograph: Sophia in her grandmother's attic, holding the very cassette. 📷\n\n🎭 In a studio filled with both modern equipment and carefully collected analog instruments, Eli finally understood. He wasn't just producing ${song.artist}'s breakout hit—he was completing a circle. With reverent hands, he added one final element to the track: a sample from an old recording of Sophia's music, ensuring that her influence would forever be embedded in the song that had inspired her in the first place. ⏳\n\nWhen ${song.title} was released, critics called it "timeless" and "nostalgic yet futuristic"—not understanding how literally true those words were. And in 1987, teenage Sophia smiled as the familiar notes played from her cassette player, somehow knowing that she was part of something much bigger than herself. 🌟\n\nSome songs aren't just created; they exist in perfect moments across time, waiting for the right people to discover them and keep the melody flowing eternally forward and backward. ${song.title} wasn't just music—it was time itself, compressed into perfect harmony. 🎶✨`
      ];
      
      setStory(storyTemplates[Math.floor(Math.random() * storyTemplates.length)]);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col h-full glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <img 
              src={song.cover} 
              alt={song.title}
              className="w-10 h-10 rounded-md"
            />
            <div>
              <div>{song.title}</div>
              <CardDescription>{song.artist}</CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 pb-4">
          {!story ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-center text-muted-foreground">
                Generate a unique story inspired by this {song.genre} track. 
                Each story features fictional characters and settings that capture the essence of the music.
              </p>
              <Button 
                onClick={generateStory} 
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-purple-700"
              >
                {isLoading ? 'Creating your story...' : 'Generate Story'}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="whitespace-pre-line">
                {story.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
