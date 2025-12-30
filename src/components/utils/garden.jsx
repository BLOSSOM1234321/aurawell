import { MindGardenPlant } from '@/api/entities';
import { User } from '@/api/entities';
import { toast } from 'sonner';

// Define the number of activities needed to reach each stage.
const GROWTH_THRESHOLDS = {
  SPROUT: 1,      // Stage 1
  SMALL_TREE: 4,  // Stage 2
  MATURE_TREE: 8,  // Stage 3
};

// Premium growth is faster
const REGULAR_GROWTH_RATE = 1;
const SACRED_GROWTH_RATE = 1.25; // 25% faster

export const updateGardenActivity = async () => {
  try {
    // Find the currently active plant for the user.
    const activePlants = await MindGardenPlant.filter({ is_active: true });
    
    if (activePlants.length === 0) {
      // No active plant to grow. User needs to plant a new one.
      return;
    }

    const plant = activePlants[0];
    const growthRate = plant.is_sacred ? SACRED_GROWTH_RATE : REGULAR_GROWTH_RATE;
    const newActivityCount = (plant.activities_logged || 0) + growthRate;

    let newGrowthStage = plant.growth_stage;
    let isFullyGrown = false;

    if (newActivityCount >= GROWTH_THRESHOLDS.MATURE_TREE) {
      newGrowthStage = 3;
      if (plant.growth_stage < 3) {
        isFullyGrown = true; // It just became fully grown
      }
    } else if (newActivityCount >= GROWTH_THRESHOLDS.SMALL_TREE) {
      newGrowthStage = 2;
    } else if (newActivityCount >= GROWTH_THRESHOLDS.SPROUT) {
      newGrowthStage = 1;
    }

    const updates = {
      activities_logged: newActivityCount,
      growth_stage: newGrowthStage,
    };
    
    // If the tree is now fully grown, deactivate it.
    if (isFullyGrown) {
      updates.is_active = false;
    }

    await MindGardenPlant.update(plant.id, updates);

    // Provide user feedback with toasts
    const plantType = plant.is_sacred ? 'sacred plant' : 'plant';
    if (isFullyGrown) {
      toast.success(`Your ${plantType} has fully grown!`, {
        description: `Visit your ${plant.is_sacred ? 'Sacred Grove' : 'Mind Garden'} to admire it and plant a new seed. 🌱`
      });
      if (plant.is_sacred) {
        await awardSacredSeed('streak_reward');
      }
    } else if (newGrowthStage > plant.growth_stage) {
      toast.info(`Your ${plantType} has grown!`, {
        description: "Your consistent efforts are helping it flourish."
      });
    } else {
      toast.info(`You've nurtured your ${plantType}!`, {
        description: "Keep up the great work to help it grow."
      });
    }

  } catch (error) {
    console.error("Failed to update Mind Garden:", error);
  }
};

export const awardSacredSeed = async (reason) => {
    try {
        const user = await User.me();
        if (!user.is_premium) return;

        const allSeeds = ['glowing_willow', 'crystal_lotus', 'starfall_tree', 'golden_bonsai'];
        let currentSeeds = user.sacred_seeds || [];
        
        const availableSeeds = allSeeds.filter(seed => !currentSeeds.includes(seed));

        if (availableSeeds.length === 0) {
            // User has all seeds, maybe award something else in future.
            return;
        }

        const newSeed = availableSeeds[Math.floor(Math.random() * availableSeeds.length)];
        currentSeeds.push(newSeed);

        await User.updateMyUserData({ sacred_seeds: currentSeeds });

        toast.success("You've earned a Sacred Seed! ✨", {
            description: `You've unlocked the '${newSeed.replace(/_/g, ' ')}' seed for your Sacred Grove.`,
        });

    } catch (error) {
        console.error("Failed to award sacred seed:", error);
    }
};