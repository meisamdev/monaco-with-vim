"use client"
import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';


export default function Home() {
  const [isVimEnabled, setIsVimEnabled] = useState(false);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const vimModeRef = useRef<any>(null);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    // setup monaco-vim
    editorRef.current = editor;
    // @ts-expect-error fix non-TS code
    window.require.config({
      paths: {
        "monaco-vim": "https://unpkg.com/monaco-vim/dist/monaco-vim"
      }
    });

    // @ts-expect-error fix non-TS code
    window.require(["monaco-vim"], function (MonacoVim) {
      vimModeRef.current = {
        MonacoVim,
        statusNode: document.querySelector(".status-node")
      };
    });
  }

  // Effect to enable/disable Vim mode without re-mounting the editor
  useEffect(() => {
    if (!editorRef.current || !vimModeRef.current) return;

    const { MonacoVim, statusNode } = vimModeRef.current;

    // If we already have a vim mode instance, dispose it before toggling
    if (vimModeRef.current.vimInstance) {
      vimModeRef.current.vimInstance.dispose();
      vimModeRef.current.vimInstance = null;
    }

    if (isVimEnabled) {
      // Enable vim mode
      vimModeRef.current.vimInstance = MonacoVim.initVimMode(editorRef.current, statusNode);
    }
  }, [isVimEnabled]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        <Editor
          height="60vh"
          width="50vw"
          language="javascript"
          onMount={handleEditorDidMount}
          defaultValue="// text code"
          theme="vs-dark"
        />
        <code className="status-node"></code>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={() => setIsVimEnabled(!isVimEnabled)}
            rel="noopener noreferrer"
          >
            {isVimEnabled ? "Disable vim" : "Enable vim"}
          </button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
