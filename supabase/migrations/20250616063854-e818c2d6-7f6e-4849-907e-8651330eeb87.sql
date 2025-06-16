
-- Create sections table
CREATE TABLE public.sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create section_resources table
CREATE TABLE public.section_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('file', 'link')),
  resource_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create modules table
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submodules table
CREATE TABLE public.submodules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  prerequisites TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submodules ENABLE ROW LEVEL SECURITY;

-- Create policies for sections
CREATE POLICY "Admins can manage all sections" ON public.sections
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Students can view published sections" ON public.sections
  FOR SELECT USING (public.get_current_user_role() = 'student');

-- Create policies for section_resources
CREATE POLICY "Admins can manage all section resources" ON public.section_resources
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Students can view section resources" ON public.section_resources
  FOR SELECT USING (public.get_current_user_role() = 'student');

-- Create policies for chapters
CREATE POLICY "Admins can manage all chapters" ON public.chapters
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Students can view published chapters" ON public.chapters
  FOR SELECT USING (public.get_current_user_role() = 'student');

-- Create policies for modules
CREATE POLICY "Admins can manage all modules" ON public.modules
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Students can view published modules" ON public.modules
  FOR SELECT USING (public.get_current_user_role() = 'student');

-- Create policies for submodules
CREATE POLICY "Admins can manage all submodules" ON public.submodules
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Students can view published submodules" ON public.submodules
  FOR SELECT USING (public.get_current_user_role() = 'student');

-- Create indexes for better performance
CREATE INDEX idx_sections_course_id ON public.sections(course_id);
CREATE INDEX idx_sections_order ON public.sections(course_id, order_index);
CREATE INDEX idx_section_resources_section_id ON public.section_resources(section_id);
CREATE INDEX idx_chapters_section_id ON public.chapters(section_id);
CREATE INDEX idx_modules_chapter_id ON public.modules(chapter_id);
CREATE INDEX idx_submodules_module_id ON public.submodules(module_id);
