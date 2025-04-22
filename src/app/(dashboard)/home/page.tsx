import EnergyCheck from "@/components/app/EnergyCheck"
import GoalTracker from "@/components/app/GoalTracker" 
import NutritionCard from "@/components/app/NutritionCard"
import StatsCard from "@/components/app/StatsCard"
import WorkoutSummaryCard from "@/components/app/WorkoutSummaryCard"
import ProgressCard from "@/components/app/ProgressCard"

export default function Home(){
    return <div>
    <div>Welcome Back, Trupal</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <GoalTracker />
                <ProgressCard />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <WorkoutSummaryCard />
                <StatsCard
                  title="Daily Steps"
                  value="8,742"
                  target="10,000"
                  icon="footprints"
                  trend={12}
                />
                <StatsCard
                  title="Water Intake"
                  value="1.8L"
                  target="2.5L"
                  icon="droplets"
                  trend={5}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NutritionCard />
                <EnergyCheck />
              </div>
            </div>
    
}