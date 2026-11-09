export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  intro_video: string | null;
  image_url: string | null;
  created_at?: string;
}

export interface Enrollment {
  course_id: string;
  status: EnrollmentStatus;
}

export interface CourseVideo {
  id: string;
  course_id: string;
  title: string;
  youtube_url: string;
  duration: string | null;
  position: number | null;
}

export interface CoursePdf {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  file_url: string;
  position: number | null;
  created_at: string;
}

export interface CourseReview {
  id: string;
  course_id: string;
  rating: number;
  review: string | null;
}
