// /api/publish/route.js
import { commitMarkdownFiles } from '@/app/lib/github';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { drafts } = await req.json();
    console.log('Received drafts for publishing:', drafts);

    // Validate drafts
    if (!drafts || drafts.length === 0) {
      console.log('No drafts provided');
      return NextResponse.json(
        { success: false, message: 'No drafts provided', results: [], errors: [] },
        { status: 400 }
      );
    }

    const invalidDraft = drafts.find(d => !d.title?.trim() || !d.body?.trim());
    if (invalidDraft) {
      console.log('Invalid draft found:', invalidDraft);
      return NextResponse.json(
        { success: false, message: 'All drafts must have a title and body', results: [], errors: [] },
        { status: 400 }
      );
    }

    // Prepare files
    const files = drafts.map(draft => ({
      fileName: `${draft.slug}.md`,
      content: `# ${draft.title}\n\n${draft.body}`,
    }));

    console.log('Prepared files for commit:', files);

    // Commit all files sequentially
    const results = await commitMarkdownFiles(files);

    // Collect errors if any
    const errors = results.filter(r => !r.success).map(r => ({
      file: r.file,
      error: r.error,
    }));

    // Detect rate limit errors explicitly
    const rateLimitError = errors.find(e => e.error?.includes('rate limit'));
    if (rateLimitError) {
      console.log('Rate limit error detected:', rateLimitError);
      return NextResponse.json(
        { success: false, message: 'GitHub API rate limit exceeded', results, errors },
        { status: 403 }
      );
    }

    console.log('Commit results:', results);

    return NextResponse.json({
      success: true,
      results, // all results with success/fail per file
      errors,  // all failed file errors
    });
  } catch (err) {
    console.error('Error in publish route:', err);
    return NextResponse.json(
      { success: false, results: [], errors: [{ error: err.message }] },
      { status: 500 }
    );
  }
}









// import { commitMarkdownFiles } from '@/app/lib/github';
// import { NextResponse } from 'next/server';
// import simpleGit from 'simple-git';
// import fs from 'fs/promises';

// export async function POST(req) {
//   try {
//     const { drafts } = await req.json();

//     if (!drafts || drafts.length === 0) {
//       return NextResponse.json({ success: false, message: 'No drafts provided' }, { status: 400 });
//     }

//     // 🔹 First commit to GitHub via API
//     const files = drafts.map(draft => ({
//       fileName: `${draft.slug}.md`,
//       content: `# ${draft.title}\n\n${draft.body}`,
//     }));
//     const results = await commitMarkdownFiles(files);

//     // 🔹 Then also update local repo with simple-git
//     const git = simpleGit();
//     for (const file of files) {
//       const filePath = `./content/${file.fileName}`;
//       await fs.writeFile(filePath, file.content, 'utf-8');
//       await git.add(filePath);
//     }
//     await git.commit(`Add or update ${files.length} draft(s)`);
//     await git.push();

//     return NextResponse.json({ success: true, results });
//   } catch (err) {
//     console.error('Error in publish route:', err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }