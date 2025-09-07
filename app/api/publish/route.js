import { commitMarkdownFiles } from '@/app/lib/github';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { drafts } = await req.json();

    // Validate drafts
    if (!drafts || drafts.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No drafts provided', results: [], errors: [] },
        { status: 400 }
      );
    }

    const invalidDraft = drafts.find(d => !d.title?.trim() || !d.body?.trim());
    if (invalidDraft) {
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

    const results = await commitMarkdownFiles(files);

    // Collect errors if any
    const errors = results.filter(r => !r.success).map(r => ({
      file: r.file,
      error: r.error,
    }));

    // Detect rate limit errors explicitly
    const rateLimitError = errors.find(e => e.error?.includes('rate limit'));
    if (rateLimitError) {
      return NextResponse.json(
        { success: false, message: 'GitHub API rate limit exceeded', results, errors },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      results,
      errors
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, results: [], errors: [{ error: err.message }] },
      { status: 500 }
    );
  }
}