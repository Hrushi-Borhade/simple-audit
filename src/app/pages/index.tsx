import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import { call } from "figma-await-ipc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const figmaMessageTypes = {
  createRectangle: "create-rectangle",
  successMessage: "success-message",
  readFromFile: "read-from-file",
  selectionChange: "selection-change",
  sendBlendRes: "send-blend-res"
};

export const Component: FC = function () {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uniqueColors, setUniqueColors] = useState<
    | {
        name: string;
        color: {
          r: number;
          g: number;
          b: number;
        };
        opacity: number;
        frequency: number;
      }[]
    | null
  >(null);
  const [uniqueSpacing, setUniqueSpacing] = useState<
    | {
        value: number;
        frequency: number;
      }[]
    | null
  >(null);
  const [uniqueCornerRadius, setUniqueCornerRadius] = useState<
    | {
        value: number;
        frequency: number;
      }[]
    | null
  >(null);

  const handleReadFile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: {
        success: boolean;
        message: string;
        data: {
          uniqueColors: {
            name: string;
            color: {
              r: number;
              g: number;
              b: number;
            };
            opacity: number;
            frequency: number;
          }[];
          uniqueSpacing: {
            value: number;
            frequency: number;
          }[];
          uniqueCornerRadius: {
            value: number;
            frequency: number;
          }[];
        };
      } = await call(figmaMessageTypes.readFromFile);
      console.log("response from readFromFile", response);
      setUniqueColors(response.data.uniqueColors);
      setUniqueSpacing(response.data.uniqueSpacing);
      setUniqueCornerRadius(response.data.uniqueCornerRadius);
      setIsComplete(true);
    } catch (err) {
      console.error("Error reading file:", err);
      setError(err instanceof Error ? err.message : "Failed to read file");
      setIsComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="flex w-full grow flex-col overflow-auto bg-background-primary p-2">
        <div className="flex h-full w-full flex-col gap-2">
          {error && (
            <p className="mb-2 text-small-regular text-red-500">{error}</p>
          )}
          {isComplete ? (
            <div className="flex h-full w-full flex-col gap-2">
              <div className="flex w-full items-center justify-between">
                <p className="text-small-regular text-txt-secondary">
                  Unique Color
                </p>
                <p className="text-small-regular text-txt-secondary">Count</p>
              </div>
              <div className="flex flex-col gap-1">
                {uniqueColors?.map((color, index) => (
                  <div
                    className="flex items-center justify-between border-b border-bodr-primary"
                    key={index}
                  >
                    <div
                      style={{
                        borderRadius: "4px",
                        backgroundColor: `rgba(${color.color.r * 255}, ${color.color.g * 255}, ${color.color.b * 255}, ${color.opacity})`
                      }}
                      className="h-4 w-4"
                    />
                    <p className="text-small-regular text-txt-primary">
                      {color.frequency}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex w-full items-center justify-between mt-4">
                <p className="text-small-regular text-txt-secondary">
                  Unique Spacing
                </p>
                <p className="text-small-regular text-txt-secondary">Count</p>
              </div>
              <div className="flex flex-col gap-1">
                {uniqueSpacing?.map((spacing, index) => (
                  <div
                    className="flex items-center justify-between border-b border-bodr-primary"
                    key={index}
                  >
                    <p className="text-small-regular text-txt-primary">
                      {spacing.value}
                    </p>
                    <p className="text-small-regular text-txt-primary">
                      {spacing.frequency}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex w-full items-center justify-between mt-4">
                <p className="text-small-regular text-txt-secondary">
                  Unique Corner Radius
                </p>
                <p className="text-small-regular text-txt-secondary">Count</p>
              </div>
              <div className="flex flex-col gap-1">
                {uniqueCornerRadius?.map((cornerRadius, index) => (
                  <div
                    className="flex items-center justify-between border-b border-bodr-primary"
                    key={index}
                  >
                    <p className="text-small-regular text-txt-primary">
                      {cornerRadius.value}
                    </p>
                    <p className="text-small-regular text-txt-primary">
                      {cornerRadius.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Button
              className="w-60"
              onClick={handleReadFile}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-txt-primary" />
              ) : (
                <span className="text-small-regular text-txt-primary">
                  Read from file
                </span>
              )}
            </Button>
          )}
        </div>
        <Outlet />
      </main>
    </>
  );
};