// file: app/api/publish/route.js
// purpose: API route to handle Publish All button
// updates:
// ✅ uses commitMarkdownFiles to commit multiple drafts
// ✅ returns success/error per file

import { commitMarkdownFiles } from '@/app/lib/github';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { drafts } = await req.json();
    if (!drafts || drafts.length === 0) return NextResponse.json({ success: false, message: 'No drafts provided' });

    const files = drafts.map(draft => ({
      fileName: `${draft.title.replace(/\s+/g, '-').toLowerCase()}.md`,
      content: `# ${draft.title}\n\n${draft.body}`,
    }));

    const results = await commitMarkdownFiles(files);

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}







// import { commitMarkdownFile } from "@/app/lib/github";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { drafts } = await req.json();

//     const results = await Promise.all(
//       drafts.map(async (draft) => {
//         try {
//           const filename = `content/${draft.title.replace(/\s+/g, '-')}.md`;
//           const md = `# ${draft.title}\n\n${draft.body}`;
//           const data = await commitMarkdownFile(filename, md);
//           return { success: true, data };
//         } catch (e) {
//           return { success: false, error: e.message, title: draft.title };
//         }
//       })
//     );

//     return NextResponse.json({ success: true, results });
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json(
//       { success: false, error: e.message },
//       { status: 500 }
//     );
//   }
// }