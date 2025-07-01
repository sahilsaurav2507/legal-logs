import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { practiceAreasApi, PracticeArea } from '@/services/api';
import { PRACTICE_AREAS } from '@/constants/practiceAreas';
import { Loader2 } from 'lucide-react';

interface PracticeAreaSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showContentStats?: boolean;
  className?: string;
}

const PracticeAreaSelect: React.FC<PracticeAreaSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select your practice area",
  disabled = false,
  showContentStats = false,
  className
}) => {
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>(PRACTICE_AREAS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPracticeAreas = async () => {
      if (!showContentStats) {
        // Use static data if we don't need content stats
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await practiceAreasApi.getPracticeAreaCategories();
        setPracticeAreas(response.categories);
      } catch (err) {
        console.error('Failed to fetch practice areas:', err);
        setError('Failed to load practice areas');
        // Fallback to static data
        setPracticeAreas(PRACTICE_AREAS);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeAreas();
  }, [showContentStats]);

  const formatOptionLabel = (area: PracticeArea): string => {
    if (showContentStats && area.post_count !== undefined) {
      return `${area.label} ${area.post_count > 0 ? `(${area.post_count} posts)` : '(No posts yet)'}`;
    }
    return area.label;
  };

  const getOptionDescription = (area: PracticeArea): string => {
    if (showContentStats && area.has_content === false) {
      return `${area.description} - No content available yet`;
    }
    return area.description;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">Loading practice areas...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {practiceAreas.map((area) => (
            <SelectItem 
              key={area.value} 
              value={area.value}
              className="cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  {formatOptionLabel(area)}
                </span>
                {area.description && (
                  <span className="text-xs text-muted-foreground mt-1">
                    {getOptionDescription(area)}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}. Using default options.
        </p>
      )}
      
      {showContentStats && !loading && !error && (
        <p className="text-xs text-muted-foreground mt-2">
          Practice areas with content are prioritized in recommendations
        </p>
      )}
    </div>
  );
};

export default PracticeAreaSelect;
