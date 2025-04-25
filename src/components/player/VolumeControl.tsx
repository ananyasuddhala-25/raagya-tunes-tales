
import { Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  return (
    <div className="w-1/4 flex justify-end items-center gap-2">
      <Volume2 className="h-4 w-4 text-muted-foreground" />
      <Slider
        value={[volume]}
        min={0}
        max={100}
        step={1}
        onValueChange={([value]) => onVolumeChange(value)}
        className="w-24"
      />
    </div>
  );
}

