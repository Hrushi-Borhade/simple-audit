import { argv } from "process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const outputDir = argv[2];
const componentInput = argv[3];
const componentName = componentInput
  ? componentInput
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  : (() => {
      const split = outputDir.split("/");

      const last = split.pop();

      if (!last) {
        throw new Error(`Not a valid directory name:  ${outputDir}`);
      }

      return last
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("");
    })();
if (componentName) {
  if (componentName.length < 3) {
    console.error(
      `Please provide a component name with at least 3 characters.`
    );
    process.exit();
  }
  createComponentFile(componentName, outputDir);
} else {
  console.log("Please provide a component name as an argument.");
}

function generateComponent(componentName: string): string {
  return `import { FC } from "react";
import { LoaderFunctionArgs, useLoaderData, useRouteError } from "react-router"
import { getErrorBoundaryMessage } from "@/lib";
import { config } from "@/constants";

export async function loader({ params }: LoaderFunctionArgs) {
  return params || null;
}

export const Component: FC = function() {
  const data = useLoaderData();

  console.log(data);

  return (
    <main>
      ${componentName}
    </main>
  )
}
if (config.isDevelopment) {
  Component.displayName = "${componentName}";
}

export const ErrorBoundary: FC = function () {
  const error = useRouteError();

  const errorContent = getErrorBoundaryMessage(error);

  return (
    <section className="flex flex-col items-center justify-center h-full">
      {errorContent}
    </section>
  );
};
if (config.isDevelopment) {
  ErrorBoundary.displayName = "${componentName}ErrorBoundary";
}
`;
}

function createComponentFile(componentName: string, outputDir = ``): void {
  const parentPath = `src/app/pages`;

  outputDir = join(parentPath, outputDir);
  const content = generateComponent(
    componentName[0].toUpperCase() + componentName.slice(1)
  );
  const fileName = `index.tsx`;
  const dirPath = join(outputDir);
  const filePath = join(dirPath, fileName);

  try {
    // Recursively create the directory if it doesn't exist
    mkdirSync(dirPath, { recursive: true });

    // Write the file
    writeFileSync(filePath, content);
    console.log(`Component ${componentName} created at ${filePath}`);
  } catch (error) {
    console.error(`Error creating component ${componentName}:`, error);
  }
}
