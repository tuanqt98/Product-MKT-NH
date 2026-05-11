import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const skillsPath = fs.existsSync(path.join(process.cwd(), 'skills'))
      ? path.join(process.cwd(), 'skills')
      : path.join(process.cwd(), '../skills');
    const skillFile = path.join(skillsPath, id, 'SKILL.md');

    if (!fs.existsSync(skillFile)) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const content = fs.readFileSync(skillFile, 'utf8');
    
    // Simple frontmatter extractor
    const nameMatch = content.match(/name:\s*(.*)/);
    const descMatch = content.match(/description:\s*(.*)/);
    
    return NextResponse.json({
      id,
      name: nameMatch ? nameMatch[1].trim() : id,
      description: descMatch ? descMatch[1].trim() : '',
      content: content
    });
  } catch (error) {
    console.error('Error reading skill detail:', error);
    return NextResponse.json({ error: 'Failed to read skill' }, { status: 500 });
  }
}
