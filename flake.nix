{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, flake-utils, nixpkgs, ... }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs { inherit system; };
        nexxontech_hub = pkgs.stdenvNoCC.mkDerivation {
          pname = "nexxontech_hub";
          version = "0.1.0";

          src = ./.;
          buildInputs = with pkgs; [
            zola
          ];

          buildPhase = ''
            zola build
          '';

          installPhase = ''
            cp -r public/ $out/
          '';
        };
      in {
        defaultPackage = nexxontech_hub;
        devShell = pkgs.mkShell {
          name = "nexxontech_hub_devenv";
          packages = (with pkgs; [
            simple-http-server
            tailwindcss
            zola
          ]);
        };
      }
    );
}
