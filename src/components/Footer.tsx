export default function Footer() {
  return (
    <footer className="mt-16 pb-6 text-center text-stone-500 text-sm">
      <p>
        Built with{' '}
        <a
          href="https://aistudio.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:underline"
        >
          Google AI Studio
        </a>{' '}
        &amp; Gemini
      </p>
    </footer>
  );
}
