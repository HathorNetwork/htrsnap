{
  description = "virtual environments";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    devshell.url = "github:numtide/devshell";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, flake-utils, devshell, nixpkgs }:
    flake-utils.lib.eachDefaultSystem (system: {
      devShell =
        let
          pkgs = import nixpkgs {
            inherit system;

            overlays = [ devshell.overlay ];
          };

          nodejs = pkgs.nodejs-16_x;

          # Because of this bug: https://github.com/yarnpkg/yarn/issues/8405
          # We can't use the latest yarn build, so compile the last working version (v1.19.0)
          # from the tarball:
          yarn = pkgs.stdenv.mkDerivation {
            name = "yarn";
            src = pkgs.fetchzip {
              url = "https://github.com/yarnpkg/yarn/releases/download/v1.19.0/yarn-v1.19.0.tar.gz";
              sha256 = "BOtufTAXGK1VU10XqER+NTUUo/QdSNUC4Tz2HudIApI=";
            };
            buildInputs = [ nodejs ];
            installPhase = ''
              mkdir -p $out/{bin,libexec/yarn/,share/bash-completion/completions/}
              cp -R . $out/libexec/yarn
              ln -s $out/libexec/yarn/bin/yarn.js $out/bin/yarn
              ln -s $out/libexec/yarn/bin/yarn.js $out/bin/yarnpkg
            '';

          };
        in
        pkgs.devshell.mkShell {
          packages = with pkgs; [
            nodejs
            yarn
          ];
        };
    });
}
