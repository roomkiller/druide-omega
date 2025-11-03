import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function PersonalitySlider({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 9, 
  step = 1,
  description,
  color = "purple"
}) {
  const getIntensityLabel = (val, maxVal) => {
    const percentage = (val / maxVal) * 100;
    if (percentage >= 80) return "Très élevé";
    if (percentage >= 60) return "Élevé";
    if (percentage >= 40) return "Modéré";
    if (percentage >= 20) return "Faible";
    return "Très faible";
  };

  const getColorClass = (val, maxVal) => {
    const percentage = (val / maxVal) * 100;
    if (percentage >= 80) return `bg-${color}-600`;
    if (percentage >= 60) return `bg-${color}-500`;
    if (percentage >= 40) return `bg-${color}-400`;
    if (percentage >= 20) return `bg-${color}-300`;
    return `bg-${color}-200`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium text-slate-900">{label}</Label>
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {value}/{max}
          </Badge>
          <Badge className={`text-xs ${getColorClass(value, max)} text-white`}>
            {getIntensityLabel(value, max)}
          </Badge>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}