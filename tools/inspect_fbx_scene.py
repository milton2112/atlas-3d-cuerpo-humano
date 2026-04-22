import argparse
import pathlib
import sys

import bpy


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--limit", type=int, default=260)
    argv = sys.argv
    argv = argv[argv.index("--") + 1 :] if "--" in argv else []
    args = parser.parse_args(argv)

    source = pathlib.Path(args.source)
    clear_scene()
    bpy.ops.import_scene.fbx(filepath=str(source), use_anim=False)

    print(f"SCENE {source}")
    print("COLLECTIONS")
    for collection in bpy.data.collections:
        print(f"  {collection.name}")

    print("OBJECTS")
    for index, obj in enumerate(bpy.context.scene.objects):
        if index >= args.limit:
            print(f"... {len(bpy.context.scene.objects) - args.limit} more")
            break
        mats = [slot.material.name for slot in obj.material_slots if slot.material]
        print(f"{index:04d} | {obj.type:<8} | {obj.name} | mats={','.join(mats)}")


if __name__ == "__main__":
    main()
