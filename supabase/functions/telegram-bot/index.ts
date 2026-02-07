import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TelegramUpdate {
  message?: {
    message_id: number;
    from: {
      id: number;
      username?: string;
      first_name?: string;
    };
    chat: {
      id: number;
    };
    text?: string;
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const update: TelegramUpdate = await req.json();
    
    console.log("Telegram update received:", JSON.stringify(update));

    if (!update.message?.text) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { from, chat, text } = update.message;
    const telegramId = from.id;
    const chatId = chat.id;
    const username = from.username || from.first_name || "User";

    // Get or create user
    let { data: telegramUser } = await supabase
      .from("telegram_users")
      .select("*")
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (!telegramUser) {
      const { data: newUser, error: insertError } = await supabase
        .from("telegram_users")
        .insert({ telegram_id: telegramId, telegram_username: username, chat_id: chatId })
        .select()
        .single();
      
      if (insertError) {
        console.error("Error creating user:", insertError);
        throw insertError;
      }
      telegramUser = newUser;
    }

    // Get user's tasks
    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("telegram_user_id", telegramUser.id)
      .order("created_at", { ascending: false });

    const taskList = tasks?.map(t => 
      `${t.completed ? '✅' : '⬜'} ${t.text}${t.due_date ? ` (${t.due_date})` : ''}`
    ).join('\n') || 'Список задач пуст';

    let reply = "";
    const command = text.toLowerCase().trim();

    // Handle commands
    if (command === "/start") {
      reply = `👋 Привет, ${username}!\n\nЯ ZenTask бот — помогу управлять задачами.\n\n📝 Команды:\n/tasks — показать задачи\n/add <задача> — добавить задачу\n/done <номер> — отметить выполненной\n/delete <номер> — удалить задачу\n\nИли просто напиши мне, и я помогу с планированием! 🚀`;
    } else if (command === "/tasks") {
      if (!tasks || tasks.length === 0) {
        reply = "📋 У тебя пока нет задач.\n\nДобавь первую командой:\n/add Название задачи";
      } else {
        reply = `📋 Твои задачи:\n\n${tasks.map((t, i) => 
          `${i + 1}. ${t.completed ? '✅' : '⬜'} ${t.text}${t.due_date ? ` 📅 ${t.due_date}` : ''}`
        ).join('\n')}\n\n✏️ /done <номер> — выполнить\n🗑 /delete <номер> — удалить`;
      }
    } else if (command.startsWith("/add ")) {
      const taskText = text.substring(5).trim();
      if (taskText) {
        await supabase.from("tasks").insert({
          telegram_user_id: telegramUser.id,
          text: taskText,
        });
        reply = `✅ Задача добавлена:\n"${taskText}"`;
      } else {
        reply = "❌ Укажи текст задачи: /add Купить молоко";
      }
    } else if (command.startsWith("/done ")) {
      const num = parseInt(text.substring(6).trim());
      if (tasks && num > 0 && num <= tasks.length) {
        const task = tasks[num - 1];
        await supabase.from("tasks").update({ completed: true }).eq("id", task.id);
        reply = `✅ Отлично! Задача выполнена:\n"${task.text}"`;
      } else {
        reply = "❌ Неверный номер. Посмотри список: /tasks";
      }
    } else if (command.startsWith("/delete ")) {
      const num = parseInt(text.substring(8).trim());
      if (tasks && num > 0 && num <= tasks.length) {
        const task = tasks[num - 1];
        await supabase.from("tasks").delete().eq("id", task.id);
        reply = `🗑 Задача удалена:\n"${task.text}"`;
      } else {
        reply = "❌ Неверный номер. Посмотри список: /tasks";
      }
    } else {
      // AI assistant for free-form messages
      const systemPrompt = `Ты — дружелюбный ИИ-ассистент ZenTask в Telegram. Помогаешь пользователю управлять задачами.

Текущие задачи пользователя:
${taskList}

Правила:
- Отвечай кратко (2-4 предложения)
- Помогай формулировать задачи
- Предлагай разбивать большие задачи
- Напоминай о невыполненных
- Используй эмодзи
- Говори на русском

Если пользователь хочет добавить задачу, напомни про /add команду.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text },
          ],
        }),
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json();
        reply = data.choices?.[0]?.message?.content || "Не понял, попробуй ещё раз 🤔";
      } else {
        reply = "Упс, что-то пошло не так. Попробуй позже! 😅";
      }
    }

    // Send reply to Telegram
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
        parse_mode: "HTML",
      }),
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Telegram bot error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
