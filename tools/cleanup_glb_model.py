import argparse
import os
import sys

import bpy


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    parser = argparse.ArgumentParser(description="Clean helper lines/points from a GLB and optionally decimate meshes.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--ratio", type=float, default=1.0)
    return parser.parse_args(argv)


def reset_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def clean_scene(ratio):
    removable_words = ("path", "cross section", "section", "guide", "helper", "axis", "axes", "grid", "label", "text", "curve", "line", "annotation", "shortcut", "empty")
    remove = []
    for obj in bpy.context.scene.objects:
        name = f"{obj.name} {obj.type}".lower()
        simple_name = obj.name.lower()
        if obj.type in {"CURVE", "FONT", "EMPTY"} or simple_name.endswith((".j", ".t", ".g")) or any(word in name for word in removable_words):
            remove.append(obj)
    for obj in remove:
        bpy.data.objects.remove(obj, do_unlink=True)

    if ratio < 0.99:
        for obj in list(bpy.context.scene.objects):
            if obj.type != "MESH":
                continue
            bpy.context.view_layer.objects.active = obj
            obj.select_set(True)
            modifier = obj.modifiers.new("atlas_decimate", "DECIMATE")
            modifier.ratio = max(0.15, min(1.0, ratio))
            try:
                bpy.ops.object.modifier_apply(modifier=modifier.name)
            except RuntimeError:
                obj.modifiers.remove(modifier)
            obj.select_set(False)


def main():
    args = parse_args()
    reset_scene()
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(args.input))
    clean_scene(args.ratio)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(args.output), export_format="GLB", export_texcoords=True, export_normals=True, export_materials="EXPORT")


if __name__ == "__main__":
    main()
