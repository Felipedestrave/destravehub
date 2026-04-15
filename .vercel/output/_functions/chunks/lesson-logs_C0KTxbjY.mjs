import { s as supabase } from './supabase_Cb0dhCq8.mjs';

const lessonLogService = {
  async listForStudent(studentId) {
    const { data, error } = await supabase.from("lesson_logs").select("*").eq("student_id", studentId).order("date", { ascending: false });
    if (error) {
      console.error("Error fetching lesson logs:", error);
      return [];
    }
    return data;
  },
  async create(log) {
    const { data, error } = await supabase.from("lesson_logs").insert(log).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id) {
    const { error } = await supabase.from("lesson_logs").delete().eq("id", id);
    if (error) throw error;
  }
};

export { lessonLogService as l };
