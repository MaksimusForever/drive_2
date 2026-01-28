import { Car, BookOpen, MapPin, Award } from 'lucide-react';

const icons = { 1: Car, 2: BookOpen, 3: MapPin, 4: Award };

export default function TimelineStep({ number, title, description, isLast }) {
  const Icon = icons[number] || Car;
  return (
    <div className="timeline-item">
      <div className="timeline-item::before"><Icon size={16} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {!isLast && <div className="timeline-line"></div>}
    </div>
  );
}