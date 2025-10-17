import { spawn } from "child_process";
import * as fs from "fs";


// gnereating dynamic file content
async function dynamic() {
    return Date().toLocaleString()

}
// dynamic file content chnageing fuction
const dynamicFileChanging = async () => {
    try {
        const res = await dynamic()
        fs.promises.writeFile("text.txt", `${res}`,"utf-8")
        return res
    } catch (error) {
        
        throw error;
    }
}

//
const commands: string[] = ['git add .', 'git commit -m "up"', 'git push -u origin main']

// function to run single command

async function runSingleCommand(cmd: string) {
    
    return new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve, reject) => {
        const child = spawn(cmd, { shell: true })
        let stdoutChunks: string[] = [];
        let stderrChunks: string[] = [];

        // collect stdout chunks
        child.stdout?.on("data", (data) => {
            const s = data.toString();
            //console.log("OUTPUT:", s);
            stdoutChunks.push(s);
        });

        // collect stderr chunks
        child.stderr?.on("data", (data) => {
            const s = data.toString();
            //console.error("ERROR:", s);
            stderrChunks.push(s);
        });

        // spawn error (e.g., command not found)
        child.on("error", (err) => {
            reject(err);
        });

        // resolve when the process exits
        child.on("close", (code) => {
            const stdout = stdoutChunks.join("");
            const stderr = stderrChunks.join("");
            resolve({ code, stdout, stderr });
        });
    });
}


async function call() {
    try {
        for(let i=0;i<commands.length;i++){
            const res = await runSingleCommand(commands[i])
            //console.log(res);
            
            if(!res){
                // 
                //console.log("Something breaks");
                return
            }
        }
    } catch (error) {
        //console.log(error);
        
    }
    
}



const test = async function test() {
    const res = await dynamicFileChanging()
    const fin = await call()
}

let running = false;

setInterval(() => {
    if (running) {
        return;
    }
    running = true;

    (async () => {
        try {
            await test();
        } catch (e) {
            //console.error("Run failed:", e);
        } finally {
            running = false;
        }
    })();

}, 5000)