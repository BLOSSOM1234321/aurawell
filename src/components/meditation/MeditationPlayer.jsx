
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Star,
  Volume2,
  VolumeX,
  AlertTriangle,
  Headphones,
  Rewind,
  FastForward
} from "lucide-react";
import { User } from "@/api/entities";

const meditationScripts = {
  1: [
    "**Introduction:** Start your day with clarity and presence. Sit or stand comfortably, take a deep breath, and prepare to greet the day mindfully.",
    "1. Take three slow, deep breaths, noticing the rise and fall of your chest.",
    "2. Scan your body from feet to head, releasing tension.",
    "3. Focus on sensations in your toes, legs, torso, arms, neck, and head, relaxing each part.",
    "4. Visualize your day ahead unfolding calmly and positively.",
    "5. Set a positive intention for the day.",
    "6. Take another deep breath and notice your surroundings.",
    "7. Affirm silently: 'I am present. I am ready for this day.'",
    "8. Stretch gently, rolling your shoulders and hands.",
    "9. Take a final deep breath, feeling energy and focus.",
    "10. Open your eyes and carry this mindfulness forward."
  ],
  2: [
    "**Introduction:** Ease feelings of anxiety and tension. Sit or lie down comfortably.",
    "1. Close your eyes and take three slow, deep breaths.",
    "2. Focus on your inhale bringing calm and exhale releasing tension.",
    "3. Notice any areas of tightness in your body and release them.",
    "4. Visualize a safe, calm place. Imagine every detail vividly.",
    "5. Repeat silently: 'I am safe. I am calm.'",
    "6. With each breath, let go of racing thoughts.",
    "7. Focus on your hands and feet, relaxing them fully.",
    "8. Scan your body slowly, relaxing each muscle group.",
    "9. Imagine a wave of calm washing over your mind and body.",
    "10. Take a final deep breath, open your eyes, and return to your day with a sense of calm."
  ],
  3: [
    "**Introduction:** Prepare for restful sleep. Lie down in bed and close your eyes.",
    "1. Take a deep breath in, feeling your body relax.",
    "2. Slowly exhale, imagining tension leaving your body.",
    "3. Bring awareness to your feet and toes, relaxing them fully.",
    "4. Scan upward through your legs, hips, stomach, chest, arms, and shoulders.",
    "5. Release any tension in your neck, jaw, and face.",
    "6. Imagine a warm, gentle wave of relaxation moving through your body.",
    "7. Focus on slow, rhythmic breathing, in and out.",
    "8. Picture a safe, peaceful place where you feel fully relaxed.",
    "9. Let your thoughts drift by without engaging them.",
    "10. Take a final deep breath and sink into a restful sleep."
  ],
  4: [
    "**Introduction:** Sharpen your attention and clarity. Sit comfortably with a straight posture.",
    "1. Take three deep breaths, inhaling focus, exhaling distraction.",
    "2. Notice your body posture and sensations.",
    "3. Bring awareness to your surroundings without judgment.",
    "4. Visualize a bright light in your mind, representing clarity and focus.",
    "5. Focus on your breath, inhaling energy, exhaling tension.",
    "6. Repeat silently: 'I am focused and alert.'",
    "7. Scan your body, relaxing any areas of stiffness.",
    "8. Imagine a clear mental space free from distractions.",
    "9. Take a deep breath and affirm: 'I am present in this moment.'",
    "10. Open your eyes ready to engage fully with tasks."
  ],
  5: [
    "**Introduction:** Release tension and mental clutter. Sit or lie down comfortably.",
    "1. Close your eyes and take a deep breath.",
    "2. Exhale slowly, releasing tension from your body.",
    "3. Visualize stress as a dark cloud leaving your body.",
    "4. Notice any tightness in your muscles and release it.",
    "5. Repeat silently: 'I let go of what I cannot control.'",
    "6. Focus on your breath, letting it flow naturally.",
    "7. Scan your body from feet to head, relaxing each area.",
    "8. Imagine a warm light filling your body with calm energy.",
    "9. Affirm: 'I am calm, centered, and at peace.'",
    "10. Take a final deep breath and open your eyes, feeling renewed."
  ],
  6: [
    "**Introduction:** Focus fully on your breath to bring calm and presence.",
    "1. Sit comfortably with a straight back.",
    "2. Inhale for four counts, hold one, exhale for four counts.",
    "3. Notice the sensation of air entering and leaving your body.",
    "4. Scan your body for tension and release it.",
    "5. Keep your focus on the rhythm of your breath.",
    "6. If your mind wanders, gently return to breathing.",
    "7. Repeat silently: 'I am present, I am calm.'",
    "8. Visualize calm energy flowing with each inhale and exhale.",
    "9. Relax your hands, shoulders, and neck.",
    "10. Take a final deep breath and open your eyes, carrying calm with you."
  ],
  7: [
    "**Introduction:** Turn a simple walk into a mindful experience.",
    "1. Walk slowly and deliberately, noticing each step.",
    "2. Feel your feet touching the ground, your weight shifting naturally.",
    "3. Breathe naturally, coordinating with your steps.",
    "4. Observe your surroundings with curiosity, without judgment.",
    "5. Scan your body for tension and release it as you walk.",
    "6. Focus on the rhythm of movement and breathing.",
    "7. Repeat silently: 'I am present with each step.'",
    "8. Notice small details around you — sights, sounds, and smells.",
    "9. Walk mindfully, appreciating your body's ability to move.",
    "10. Conclude by standing still, taking a deep breath, and feeling refreshed."
  ],
  8: [
    "**Introduction:** Prepare for deep relaxation and sleep. Lie down comfortably.",
    "1. Close your eyes and breathe slowly.",
    "2. Bring awareness to your toes, relaxing them completely.",
    "3. Scan upward through your legs, hips, and torso, releasing tension.",
    "4. Relax your shoulders, arms, and hands.",
    "5. Soften your neck, jaw, and facial muscles.",
    "6. Imagine a warm wave of calm moving through your entire body.",
    "7. Focus on slow, rhythmic breathing.",
    "8. Allow thoughts to pass without engagement.",
    "9. Visualize drifting into a peaceful sleep.",
    "10. Take a final deep breath, fully relaxing into rest."
  ],
  9: [
    "**Introduction:** Reset your mind and body during a busy day. Sit or stand comfortably.",
    "1. Take three slow, deep breaths, feeling tension release.",
    "2. Roll your shoulders, stretch your arms, and release tightness.",
    "3. Focus on your body sensations and posture.",
    "4. Visualize a wave of fresh energy flowing through you.",
    "5. Repeat silently: 'I am calm, focused, and renewed.'",
    "6. Scan your body for any remaining tension and release it.",
    "7. Inhale deeply, filling your body with energy.",
    "8. Exhale slowly, letting go of fatigue or stress.",
    "9. Affirm: 'I return to my day with clarity and balance.'",
    "10. Take a final deep breath and open your eyes, feeling refreshed."
  ]
};

export default function MeditationPlayer({ meditation, onComplete, onBack, isLoading }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState("");

  const [guidedScript, setGuidedScript] = useState([]);
  const [user, setUser] = useState(null);
  const [audioVolume, setAudioVolume] = useState(50);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0); // New state for voice playback speed

  const audioRef = useRef(null); // Background music
  const voiceOverRef = useRef(null); // AI Voice-over
  const [voiceOverDuration, setVoiceOverDuration] = useState(0);

  // Map of background music URLs for different meditations
  const backgroundMusicUrls = {
    1: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/fd0b799da_meditation-music-368634.mp3", // Morning Mindfulness
    2: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/0ca7afc59_720970__universfield__my-dreams.mp3", // Anxiety Relief
    3: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/723f24402_736266__universfield__ethereal-ambient-atmosphere.mp3", // Deep Sleep
    4: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/f87d7e1bc_759243__lolamoore__serene-background-atmosphere.mp3", // Focus Boost
    5: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/225563b1c_796300__matio888__soothing-ambient-for-stress-relief.mp3", // Letting Go of Stress
    6: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/a72a7df17_792704__universfield__calm-horizons-30s.mp3", // Mindful Breathing
    7: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/be2b79a36_719981__universfield__blissful-serenity.mp3", // Walking Meditation
    8: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/8e26dd75a_718704__muyo5438__atmospheric-landscape-for-meditation-relaxation-and-yoga.mp3", // Body Scan for Sleep
    9: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/089fdab04_709174__geoff-bremner-audio__ambient-meditation-guitar.wav" // Quick Reset
  };
  const backgroundMusicUrl = backgroundMusicUrls[meditation.id];

  // Map of AI voice-over URLs
  const voiceOverUrls = {
    1: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/494f23b33_ElevenLabs_2025-09-02T12_59_36_Emily_pre_sp70_s55_sb75_se0_b_m2.mp3",
    2: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/3f711bc98_ElevenLabs_2025-09-02T14_14_29_Emily_pre_sp70_s55_sb75_se0_b_m2.mp3", // Anxiety Relief
    3: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/546145fda_ElevenLabs_2025-09-02T14_22_08_Emily_pre_sp70_s55_sb75_se0_b_m2.mp3", // Deep Sleep
    4: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/003421e85_ElevenLabs_2025-09-02T14_33_25_Emily_pre_sp70_s55_sb75_se0_b_m2.mp3", // Focus Boost
    5: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/48aa0d5bf_ElevenLabs_2025-09-02T14_44_29_Emily_pre_sp70_s55_sb75_se0_b_m2.mp3", // Letting Go of Stress
    6: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/0f3a0e53e_ElevenLabs_2025-09-02T18_12_38_Emily_pre_sp70_s55_sb75_se0_b_m2.mp3", // Mindful Breathing
    7: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/02c6a966d_ElevenLabs_2025-09-02T18_23_01_Emily_pre_sp70_s55_sb75_se0_b_m2.mp3", // Walking Meditation
    8: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/77ea7c787_ElevenLabs_2025-09-02T18_29_16_Emily_pre_sp70_s55_sb75_se0_b_m2.mp3", // Body Scan for Sleep
    9: "https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/9c370bf66_ElevenLabs_2025-09-02T18_34_46_Emily_pre_sp70_s55_sb75_se0_b_m2.mp3" // Quick Reset
  };
  const voiceOverUrl = voiceOverUrls[meditation.id];

  const totalTime = voiceOverUrl ? voiceOverDuration : meditation.duration * 60;

  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setAudioVolume(currentUser.sound_volume !== undefined ? currentUser.sound_volume : 50);
        setAudioEnabled(currentUser.meditation_sounds !== false);
      } catch (error) {
        console.error("Failed to load user settings:", error);
        // Set defaults if user loading fails
        setAudioVolume(50);
        setAudioEnabled(true);
      }
    };
    loadUserSettings();
  }, []);

  // Update voice playback rate when speed changes
  useEffect(() => {
    if (voiceOverRef.current) {
      voiceOverRef.current.playbackRate = voiceSpeed;
    }
  }, [voiceSpeed]);

  useEffect(() => {
    const script = meditationScripts[meditation.id] || [];
    setGuidedScript(script);
    setCurrentTime(0);
    setIsPlaying(false);
    setShowRating(false);
    setVoiceOverDuration(0); // Reset duration for new meditation
    setVoiceSpeed(1.0); // Reset speed for new meditation

    if (voiceOverRef.current) {
      voiceOverRef.current.load(); // Reload voice-over
    }
    if (audioRef.current) audioRef.current.load(); // Reload background music
  }, [meditation]);

  // Timer for non-voiced meditations
  useEffect(() => {
    let timerInterval;

    if (!voiceOverUrl && isPlaying && currentTime < totalTime) {
      timerInterval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev + 1 >= totalTime) {
            setIsPlaying(false);
            setShowRating(true);
            if (audioRef.current) audioRef.current.pause();
            return totalTime;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [isPlaying, currentTime, totalTime, voiceOverUrl]);

  // Update audio volume and handle DUCKING
  useEffect(() => {
    const bgAudio = audioRef.current;
    const voAudio = voiceOverRef.current;

    if (!bgAudio) return;

    if (!audioEnabled) {
      bgAudio.volume = 0;
      return;
    }

    let baseVolume = audioVolume / 100;
    let finalVolume = baseVolume;

    // Apply ducking if voice-over is active and playing
    if (voiceOverUrl && voAudio && !voAudio.paused && !voAudio.ended) {
      finalVolume = baseVolume * 0.2; // Duck to 20% of the selected volume
    }

    bgAudio.volume = Math.max(0, Math.min(1, finalVolume));

  }, [audioVolume, audioEnabled, isPlaying, currentTime, voiceOverUrl]); // Added currentTime and voiceOverUrl to dependencies to re-evaluate ducking state


  const formatTime = (seconds) => {
    const totalSeconds = Math.round(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    // Control background music
    if (backgroundMusicUrl && audioRef.current) {
      if (nextIsPlaying && audioEnabled) {
        // Volume is set by the useEffect, just play
        audioRef.current.play().catch(err => console.error("BG Audio play failed:", err));
      } else {
        audioRef.current.pause();
      }
    }

    // Control voice-over
    if (voiceOverUrl && voiceOverRef.current) {
      if (nextIsPlaying) {
        voiceOverRef.current.playbackRate = voiceSpeed; // Ensure correct speed
        voiceOverRef.current.play().catch(err => console.error("VO Audio play failed:", err));
      } else {
        voiceOverRef.current.pause();
      }
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    if (voiceOverRef.current) {
      voiceOverRef.current.currentTime = 0;
      voiceOverRef.current.pause();
    }
  };

  const handleSkip = (amount) => {
    // Calculate new time, ensuring it stays within bounds
    const newTime = Math.max(0, Math.min(totalTime, currentTime + amount));

    setCurrentTime(newTime);

    if (voiceOverRef.current) {
      voiceOverRef.current.currentTime = newTime;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVoiceOverEnd = () => {
    setIsPlaying(false);
    setShowRating(true); // Switch to rating card immediately
    if (audioRef.current) {
        // Fade out background music smoothly
        let vol = audioRef.current.volume;
        const fadeOut = setInterval(() => {
            if (vol > 0.05) {
                vol -= 0.05;
                if (audioRef.current) audioRef.current.volume = vol;
            } else {
                if (audioRef.current) audioRef.current.pause();
                clearInterval(fadeOut);
            }
        }, 50); // Fade out over 1 second
    }
  };

  const handleComplete = () => {
    onComplete({
      meditation_title: meditation.title,
      duration_minutes: Math.ceil(currentTime / 60),
      category: meditation.goal,
      completion_rating: rating,
      notes: notes
    });
  };

  const toggleAudio = () => {
    const nextAudioEnabled = !audioEnabled;
    setAudioEnabled(nextAudioEnabled);
    User.updateMyUserData({ meditation_sounds: nextAudioEnabled });

    if (backgroundMusicUrl && audioRef.current) {
      if (nextAudioEnabled && isPlaying) {
        // Volume will be handled by the useEffect, just play
        audioRef.current.play().catch(err => console.error("Audio play failed on toggle:", err));
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setVoiceSpeed(newSpeed);
    if (voiceOverRef.current) {
      voiceOverRef.current.playbackRate = newSpeed;
    }
  };

  const progress = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;

  const cardContent = showRating ? (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center">Session Complete! 🎉</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">{meditation.title}</h3>
          <p className="text-gray-600">
            You meditated for {formatTime(totalTime)}
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium">
            How helpful was this session?
          </label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 rounded-full transition-colors ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                <Star className={`w-8 h-8 ${star <= rating ? "fill-current" : ""}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => e.target.value.length <= 500 && setNotes(e.target.value)}
            placeholder="How do you feel? Any insights or thoughts..."
            className="w-full p-3 border border-gray-200 rounded-2xl resize-none h-20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={500}
          />
           <p className="text-right text-xs text-gray-500">{notes.length}/500</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowRating(false)}
            className="flex-1 rounded-2xl"
          >
            Back to Player
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold"
          >
            {isLoading ? 'Saving...' : 'Complete Session'}
          </Button>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="space-y-4">
        {/* Back Button Row */}
        <div className="flex items-center justify-start">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2 rounded-2xl hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Title and Description */}
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl">{meditation.title}</CardTitle>
          <p className="text-gray-600">{meditation.description}</p>
          {voiceOverUrl && (
            <p className="text-sm text-purple-600 font-medium flex items-center justify-center gap-2">
              <Headphones className="w-4 h-4" /> AI Voice Guidance Enabled
            </p>
          )}
        </div>

        {/* Controls Row - Stacked on mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {/* AI Voice Speed Control */}
          {voiceOverUrl && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Speed:</span>
              <div className="flex gap-1">
                {[0.8, 0.9, 1.0, 1.1].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      voiceSpeed === speed
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Background Music Controls */}
          {backgroundMusicUrl && (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={toggleAudio}
                className="p-2 rounded-2xl hover:bg-gray-100"
                title={audioEnabled ? "Disable background music" : "Enable background music"}
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>

              {audioEnabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Volume:</span>
                  <Slider
                    value={[audioVolume]}
                    onValueChange={(values) => setAudioVolume(values[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="w-20"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-light text-gray-700">
            {formatTime(currentTime)}
          </div>
          <div className="text-gray-500">
            of {formatTime(totalTime)}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-transform duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Controls (Play/Pause, Skip) */}
        <div className="flex justify-center items-center gap-4 md:gap-6">
          <Button
            variant="outline"
            onClick={() => handleSkip(-10)}
            className="p-4 rounded-2xl"
            title="Rewind 10 seconds"
          >
            <Rewind className="w-6 h-6" />
          </Button>

          <Button
            onClick={handlePlayPause}
            className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSkip(10)}
            className="p-4 rounded-2xl"
            title="Fast-forward 10 seconds"
          >
            <FastForward className="w-6 h-6" />
          </Button>
        </div>

        {/* Secondary Controls (Restart, Finish) */}
        <div className="flex justify-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestart}
            className="rounded-2xl text-gray-600 hover:bg-gray-100"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRating(true)}
            className="rounded-2xl text-gray-600 hover:bg-gray-100"
            disabled={currentTime === 0}
          >
            <Star className="w-4 h-4 mr-2" />
            Finish
          </Button>
        </div>

        {/* Guided Script - Always show */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              {voiceOverUrl ? 'Follow Along' : 'Guided Instructions'}
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {guidedScript.map((step, index) => (
                <div key={index} className="text-gray-700 leading-relaxed">
                  {step.startsWith('**') ? (
                    <p className="font-semibold text-purple-700 mb-2">
                      {step.replace(/\*\*/g, '')}
                    </p>
                  ) : (
                    <p className="mb-2">{step}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 p-2 bg-yellow-50 border border-yellow-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span>This is a guided meditation. It is not a substitute for professional medical advice.</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 min-h-[850px]">
      {/* Audio Element for Background Music */}
      {backgroundMusicUrl && (
        <audio
          ref={audioRef}
          src={backgroundMusicUrl}
          loop
          preload="auto"
          style={{ display: 'none' }}
          onLoadedData={() => {
            if (audioRef.current) {
              audioRef.current.volume = audioEnabled ? audioVolume / 100 : 0;
            }
          }}
        />
      )}

      {/* Audio Element for AI Voice-over */}
      {voiceOverUrl && (
        <audio
          ref={voiceOverRef}
          src={voiceOverUrl}
          preload="metadata"
          onLoadedMetadata={() => {
            if (voiceOverRef.current) {
                setVoiceOverDuration(voiceOverRef.current.duration);
                voiceOverRef.current.playbackRate = voiceSpeed; // Apply current speed on load
            }
          }}
          onTimeUpdate={() => {
            if (voiceOverRef.current) {
              setCurrentTime(voiceOverRef.current.currentTime);
            }
          }}
          onEnded={handleVoiceOverEnd}
          style={{ display: 'none' }}
        />
      )}

      {cardContent}
    </div>
  );
}
