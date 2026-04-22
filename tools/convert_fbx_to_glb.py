import argparse
import pathlib
import sys

import bpy


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def import_fbx(path):
    bpy.ops.import_scene.fbx(filepath=str(path), use_anim=False)


def cleanup_scene():
    for obj in list(bpy.context.scene.objects):
        if obj.type not in {"MESH", "ARMATURE", "EMPTY"}:
            bpy.data.objects.remove(obj, do_unlink=True)
            continue
        if obj.type == "MESH":
            obj.select_set(True)
            bpy.context.view_layer.objects.active = obj
            try:
                bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
            except Exception:
                pass
            obj.select_set(False)


def export_glb(path):
    bpy.ops.export_scene.gltf(
        filepath=str(path),
        export_format="GLB",
        export_apply=True,
        export_animations=False,
        export_yup=True,
        export_materials="EXPORT",
        export_image_format="AUTO",
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--target", required=True)
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = []
    args = parser.parse_args(argv)

    source = pathlib.Path(args.source)
    target = pathlib.Path(args.target)
    target.parent.mkdir(parents=True, exist_ok=True)

    clear_scene()
    import_fbx(source)
    cleanup_scene()
    export_glb(target)
    print(f"EXPORTED {target}")


if __name__ == "__main__":
    main()
