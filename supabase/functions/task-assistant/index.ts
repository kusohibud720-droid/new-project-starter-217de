import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tasks, message, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const taskList = tasks?.map((t: { text: string; completed: boolean; dueDate?: string }) => 
      `- ${t.completed ? '✓' : '○'} ${t.text}${t.dueDate ? ` (срок: ${t.dueDate})` : ''}`
    ).join('\n') || 'Нет задач';

    let systemPrompt = '';
    
    if (type === 'reminder') {
      systemPrompt = `Ты — дружелюбный ассистент ZenTask. Твоя задача — давать короткие напоминания и советы по продуктивности.
      
Текущие задачи пользователя:
${taskList}

Правила:
- Отвечай кратко, максимум 2-3 предложения
- Будь позитивным и мотивирующим
- Используй эмодзи для дружелюбности
- Напоминай о невыполненных задачах с приближающимися сроками
- Говори на русском языке`;
    } else {
      systemPrompt = `Ты — умный ассистент ZenTask, помогающий ставить задачи.

Текущие задачи пользователя:
${taskList}

Правила:
- Помогай формулировать задачи конкретно и выполнимо
- Предлагай разбивать большие задачи на маленькие
- Отвечай кратко и по делу
- Можешь предлагать даты для задач
- Говори на русском языке
- Используй эмодзи умеренно`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message || "Дай мне напоминание о моих задачах" },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Слишком много запросов, попробуйте позже" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Требуется пополнение баланса" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Не удалось получить ответ";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Task assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
