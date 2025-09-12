import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { Icons } from "@/components/icons";
import placeholderImagesData from "@/lib/placeholder-images.json";

export default function LoginPage() {
  const loginImage = placeholderImagesData.placeholderImages.find((p) => p.id === "login-hero");

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center items-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold font-headline">OmniServe</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Your favorite food, delivered.
            </p>
          </div>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {loginImage && (
          <Image
            src={loginImage.imageUrl}
            alt={loginImage.description}
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            data-ai-hint={loginImage.imageHint}
          />
        )}
      </div>
    </div>
  );
}
