import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const skillsPath = fs.existsSync(path.join(process.cwd(), 'skills'))
      ? path.join(process.cwd(), 'skills')
      : path.join(process.cwd(), '../skills');
    const skillDirs = fs.readdirSync(skillsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.match(/^\d{2}-/))
      .map(dirent => dirent.name)
      .sort();

    const skills = skillDirs.map(dir => {
      const skillFile = path.join(skillsPath, dir, 'SKILL.md');
      let name = dir.replace(/^\d{2}-/, '').replace(/-/g, ' ');
      let description = '';
      let category = 'strategy';
      
      try {
        const content = fs.readFileSync(skillFile, 'utf8');
        const titleMatch = content.match(/name:\s*(.*)/) || content.match(/^#\s*(.*)/m);
        const descriptionMatch = content.match(/description:\s*(.*)/);
        const categoryMatch = content.match(/category:\s*(.*)/);

        if (titleMatch) name = titleMatch[1].trim();
        if (descriptionMatch) description = descriptionMatch[1].trim().replace(/^"|"$/g, '');
        if (categoryMatch) category = categoryMatch[1].trim();
      } catch {
        // Fallback to directory name
      }

      return {
        id: dir,
        name: name,
        description,
        category,
        path: dir
      };
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error reading skills:', error);
    return NextResponse.json({ error: 'Failed to read skills' }, { status: 500 });
  }
}
