export const Logo = () => (
  <>
    <div className="block dark:hidden">
      <div className="flex items-center">
        <img src="./logo.svg" className="w-12" />
        <img src="./escrita.png" className="w-18 mt-2" />
      </div>
    </div>
    <div className="hidden dark:block">
      <div className="flex items-center">
        <img src="./logo.svg" className="w-12" />
        <img src="./escrita-dark.png" className="w-18 mt-2" />
      </div>
    </div>

  </>
);
