interface MeditationRequest {
  topic: string;
  duration: number;
  voice?: 'calm' | 'gentle' | 'soothing';
  style?: 'guided' | 'mindfulness' | 'sleep' | 'focus';
  backgroundMusic?: boolean;
}

interface GeneratedMeditation {
  id: string;
  title: string;
  script: string;
  audioUrl?: string;
  duration: number;
  generatedAt: string;
}

export class MeditationService {
  private static readonly WONDERCRAFT_API_KEY = process.env.WONDERCRAFT_API_KEY;
  private static readonly ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  /**
   * Generate a custom meditation using AI
   */
  static async generateMeditation(request: MeditationRequest): Promise<GeneratedMeditation> {
    try {
      // Step 1: Generate meditation script
      const script = await this.generateScript(request);
      
      // Step 2: Convert script to audio
      const audioUrl = await this.generateAudio(script, request.voice || 'calm');
      
      return {
        id: `med_${Date.now()}`,
        title: `${request.topic} Meditation`,
        script,
        audioUrl,
        duration: request.duration,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating meditation:', error);
      throw new Error('Failed to generate meditation');
    }
  }

  /**
   * Generate meditation script using OpenAI/Gemini
   */
  private static async generateScript(request: MeditationRequest): Promise<string> {
    const prompt = `
    Create a ${request.duration}-minute guided meditation script focused on "${request.topic}".
    
    Guidelines:
    - Start with breathing exercises
    - Include natural pauses (indicate with [PAUSE 5s] for 5-second breaks)
    - Use calming, gentle language
    - Address the listener as "you"
    - End with gentle awakening
    - Aim for approximately ${request.duration * 150} words
    - if very weird title is given by user about meditation topic make sure to navigate the 
      instruction in proper direction
    Style: ${request.style || 'guided'}
    Voice tone: ${request.voice || 'calm'}
    `;

    // This would integrate with your existing Gemini service
    // For now, return a template
    return `
    Welcome to your ${request.topic} meditation. 
    
    Find a comfortable position, either sitting or lying down. 
    [PAUSE 3s]
    
    Let's begin by focusing on your breath. 
    Take a deep breath in through your nose... 
    [PAUSE 2s]
    
    And slowly exhale through your mouth... 
    [PAUSE 2s]
    
    Continue this gentle rhythm of breathing...
    [PAUSE 5s]
    
    Now, bring your attention to ${request.topic}...
    
    [Continue with meditation content based on topic and duration]
    `;
  }

  /**
   * Convert text to speech using ElevenLabs or Azure Speech
   */
  private static async generateAudio(script: string, voice: string): Promise<string> {
    if (this.ELEVENLABS_API_KEY) {
      return await this.generateWithElevenLabs(script, voice);
    } else {
      return await this.generateWithAzureSpeech(script, voice);
    }
  }

  private static async generateWithElevenLabs(script: string, voice: string): Promise<string> {
    // Convert pauses to SSML breaks
    const ssmlScript = script.replace(/\[PAUSE (\d+)s\]/g, '<break time="$1s"/>');
    
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.ELEVENLABS_API_KEY!
      },
      body: JSON.stringify({
        text: ssmlScript,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.9,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: false
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate audio with ElevenLabs');
    }

    // In a real implementation, you'd upload this to cloud storage
    // and return the URL
    return 'https://your-storage.com/generated-meditation.mp3';
  }

  private static async generateWithAzureSpeech(script: string, voice: string): Promise<string> {
    // Convert to SSML format for Azure Speech
    const ssmlScript = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-AriaNeural" style="calm">
          ${script.replace(/\[PAUSE (\d+)s\]/g, '<break time="$1s"/>')}
        </voice>
      </speak>
    `;

    // Implement Azure Speech Service integration here
    // Return audio URL after generation and upload
    return 'https://your-storage.com/generated-meditation.mp3';
  }

  /**
   * Fetch meditation content from external APIs
   */
  static async fetchMeditationLibrary(category?: string): Promise<any[]> {
    try {
      // Example: Integrate with Insight Timer API or similar
      const response = await fetch('/api/meditation/library', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meditation library');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching meditation library:', error);
      return [];
    }
  }

  /**
   * Search for meditation content
   */
  static async searchMeditations(query: string, filters?: {
    duration?: string;
    category?: string;
    level?: string;
  }): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        search: query,
        ...filters
      });

      const response = await fetch(`/api/meditation?${params}`);
      const data = await response.json();
      
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error searching meditations:', error);
      return [];
    }
  }
}

export default MeditationService; 