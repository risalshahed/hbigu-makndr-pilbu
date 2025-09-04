import { commitMarkdownFile } from "@/app/lib/github";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { drafts } = await req.json();

    const results = await Promise.all(
      drafts.map(async (draft) => {
        try {
          const filename = `content/${draft.title.replace(/\s+/g, '-')}.md`;
          const md = `# ${draft.title}\n\n${draft.body}`;
          const data = await commitMarkdownFile(filename, md);
          return { success: true, data };
        } catch (e) {
          return { success: false, error: e.message, title: draft.title };
        }
      })
    );

    return NextResponse.json({ success: true, results });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}