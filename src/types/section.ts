
export interface Section {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SectionResource {
  id: string;
  section_id: string;
  title: string;
  resource_type: 'file' | 'link';
  resource_url: string;
  file_name?: string;
  file_size?: number;
  order_index: number;
  created_at: string;
}

export interface Chapter {
  id: string;
  section_id: string;
  title: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  chapter_id: string;
  title: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Submodule {
  id: string;
  module_id: string;
  title: string;
  content?: string;
  video_url?: string;
  order_index: number;
  is_published: boolean;
  prerequisites?: string[];
  created_at: string;
  updated_at: string;
}
