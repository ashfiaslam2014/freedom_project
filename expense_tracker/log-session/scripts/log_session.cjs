const fs = require('fs');
const path = require('path');
const os = require('os');

function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}${month}${year}`;
}

function formatDateISO(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
}

function formatTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

async function run() {
    const args = process.argv.slice(2);
    if (args.length < 4) {
        console.error('Usage: node log_session.cjs <ProjectName> <SessionTitle> <ActionsJSON> <NextStepsJSON>');
        process.exit(1);
    }

    const [projectName, sessionTitle, actionsStr, nextStepsStr] = args;
    const actions = JSON.parse(actionsStr);
    const nextSteps = JSON.parse(nextStepsStr);

    const now = new Date();
    const dateStr = formatDate(now);
    const dateISO = formatDateISO(now);
    const timeStr = formatTime();

    const vaultDir = path.join(os.homedir(), 'Desktop', 'Project_Vault');
    if (!fs.existsSync(vaultDir)) {
        fs.mkdirSync(vaultDir, { recursive: true });
    }

    const filePath = path.join(vaultDir, `${dateStr}.md`);
    let content = '';

    if (!fs.existsSync(filePath)) {
        content = `---\ndate: ${dateISO}\ntags: [dev-log]\n---\n\n`;
    } else {
        content = fs.readFileSync(filePath, 'utf8');
    }

    const projectHeader = `## [[${projectName}]]`;
    const sessionBlock = `### ${timeStr} — ${sessionTitle}\n${actions.map(a => `- ${a}`).join('\n')}\n#### Next Steps\n${nextSteps.map(s => `- [ ] ${s}`).join('\n')}\n\n`;

    if (content.includes(projectHeader)) {
        // Find the project header and append after it but before the next ## header
        const lines = content.split('\n');
        const projectIndex = lines.findIndex(line => line.trim() === projectHeader);
        
        let insertIndex = lines.length;
        for (let i = projectIndex + 1; i < lines.length; i++) {
            if (lines[i].startsWith('## ')) {
                insertIndex = i;
                break;
            }
        }
        
        lines.splice(insertIndex, 0, sessionBlock);
        content = lines.join('\n');
    } else {
        // Append at the end
        content += `${projectHeader}\n${sessionBlock}`;
    }

    fs.writeFileSync(filePath, content.trim() + '\n');
    console.log(`Successfully logged session for [[${projectName}]] to ${filePath}`);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
