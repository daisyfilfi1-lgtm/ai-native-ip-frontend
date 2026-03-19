declare module 'lucide-react' {
  import type { ComponentType, SVGProps } from 'react';

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = ComponentType<LucideProps>;

  // Navigation & Layout
  export const FileText: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Library: LucideIcon;
  export const Home: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const ArrowDownRight: LucideIcon;

  // Actions
  export const Plus: LucideIcon;
  export const Settings: LucideIcon;
  export const LogOut: LucideIcon;
  export const Edit: LucideIcon;
  export const Edit3: LucideIcon;
  export const Save: LucideIcon;
  export const Copy: LucideIcon;
  export const Send: LucideIcon;
  export const Trash: LucideIcon;
  export const Trash2: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const RefreshCcw: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const Filter: LucideIcon;
  export const GripVertical: LucideIcon;
  export const Move: LucideIcon;
  export const Link: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Share2: LucideIcon;
  export const Download: LucideIcon;
  export const Upload: LucideIcon;
  export const Maximize2: LucideIcon;
  export const Minimize2: LucideIcon;
  export const Fullscreen: LucideIcon;
  export const PenTool: LucideIcon;

  // Charts & Stats
  export const BarChart3: LucideIcon;
  export const LineChart: LucideIcon;
  export const PieChart: LucideIcon;
  export const Activity: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const TrendingDown: LucideIcon;

  // Content
  export const FolderOpen: LucideIcon;
  export const Wand2: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Zap: LucideIcon;
  export const ZapOff: LucideIcon;
  export const Flame: LucideIcon;
  export const Smile: LucideIcon;
  export const Mic: LucideIcon;
  export const Music: LucideIcon;
  export const Video: LucideIcon;
  export const Camera: LucideIcon;
  export const Image: LucideIcon;
  export const Play: LucideIcon;
  export const Pause: LucideIcon;
  export const Shuffle: LucideIcon;
  export const Scissors: LucideIcon;

  // AI & Tech
  export const Cpu: LucideIcon;
  export const Brain: LucideIcon;
  export const Bot: LucideIcon;
  export const GitBranch: LucideIcon;
  export const Database: LucideIcon;
  export const Cloud: LucideIcon;
  export const Shield: LucideIcon;

  // Communication
  export const Users: LucideIcon;
  export const User: LucideIcon;
  export const Eye: LucideIcon;
  export const Heart: LucideIcon;
  export const ThumbsUp: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Bell: LucideIcon;
  export const Search: LucideIcon;

  // Status & Feedback
  export const CheckCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Info: LucideIcon;
  export const XCircle: LucideIcon;
  export const Circle: LucideIcon;
  export const CircleDot: LucideIcon;
  export const Radio: LucideIcon;
  export const ToggleLeft: LucideIcon;
  export const ToggleRight: LucideIcon;
  export const Check: LucideIcon;
  export const CheckSquare: LucideIcon;
  export const Square: LucideIcon;
  export const Loader: LucideIcon;
  export const Loader2: LucideIcon;
  export const Power: LucideIcon;
  export const PowerOff: LucideIcon;

  // Ideas & Planning
  export const Lightbulb: LucideIcon;
  export const Target: LucideIcon;
  export const Award: LucideIcon;
  export const Star: LucideIcon;
  export const Calendar: LucideIcon;
  export const Clock: LucideIcon;
  export const BookOpen: LucideIcon;

  // Tags & Labels
  export const Hash: LucideIcon;
  export const Tag: LucideIcon;
  export const Tags: LucideIcon;
  export const Layers: LucideIcon;
  export const Layout: LucideIcon;
  export const Grid: LucideIcon;
  export const List: LucideIcon;
  export const Kanban: LucideIcon;
  export const Table: LucideIcon;

  // Finance
  export const DollarSign: LucideIcon;
}
