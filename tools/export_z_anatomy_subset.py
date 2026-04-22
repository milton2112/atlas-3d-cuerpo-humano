import argparse
import pathlib
import sys

import bpy


SYSTEM_RULES = {
    "respiratory": [
        "respiratory",
        "lung",
        "bronch",
        "trachea",
        "larynx",
        "epiglottis",
        "pleura",
        "nasal cavity",
    ],
    "urinary": [
        "urinary",
        "kidney",
        "renal pelvis",
        "ureter",
        "bladder",
        "urethra",
    ],
    "endocrine": [
        "endocrine",
        "thyroid",
        "parathyroid",
        "hypophysis",
        "adenohypophysis",
        "neurohypophysis",
        "pineal",
        "suprarenal",
        "adrenal",
    ],
    "digestive": [
        "digestive",
        "liver",
        "gallbladder",
        "pancreas",
        "stomach",
        "oesophagus",
        "esophagus",
        "duodenum",
        "jejunum",
        "ileum",
        "intestine",
        "colon",
        "cecum",
        "caecum",
        "appendix",
        "rectum",
        "anal canal",
        "anus",
    ],
    "reproductive-male": [
        "male genital",
        "testis",
        "epididymis",
        "ductus deferens",
        "seminal",
        "prostate",
        "ejaculatory duct",
        "penis",
        "glans",
        "corpus cavernosum",
        "corpus spongiosum",
    ],
}

ANNOTATION_SUFFIXES = (".j", ".t", ".g")
JUNK_WORDS = ("surface", "border", "pole", "hilum", "impression", "fossa", "notch")
SYSTEM_EXCLUDES = {
    "urinary": ["gallbladder"],
}


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def normalize_name(value):
    return value.lower().replace("_", " ").replace("-", " ")


def should_keep_object(obj, system_key):
    if obj.type not in {"MESH", "ARMATURE", "EMPTY"}:
        return False

    name = normalize_name(obj.name)
    if obj.type in {"ARMATURE", "EMPTY"}:
        return False
    if name.endswith(ANNOTATION_SUFFIXES):
        return False
    if any(word in name for word in JUNK_WORDS):
        return False
    if any(token in name for token in SYSTEM_EXCLUDES.get(system_key, [])):
        return False

    return any(token in name for token in SYSTEM_RULES[system_key])


def cleanup_and_select(system_key):
    kept = []
    for obj in list(bpy.context.scene.objects):
        if should_keep_object(obj, system_key):
            kept.append(obj)
        else:
            bpy.data.objects.remove(obj, do_unlink=True)

    bpy.ops.object.select_all(action="DESELECT")
    for obj in kept:
        obj.select_set(True)
        if obj.type == "MESH":
            bpy.context.view_layer.objects.active = obj
            try:
                bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
            except Exception:
                pass

    print(f"KEPT {system_key}: {len(kept)} objects")
    for obj in kept[:80]:
        print(f"  {obj.name}")


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
    parser.add_argument("--system", required=True, choices=sorted(SYSTEM_RULES))
    argv = sys.argv
    argv = argv[argv.index("--") + 1 :] if "--" in argv else []
    args = parser.parse_args(argv)

    source = pathlib.Path(args.source)
    target = pathlib.Path(args.target)
    target.parent.mkdir(parents=True, exist_ok=True)

    clear_scene()
    bpy.ops.import_scene.fbx(filepath=str(source), use_anim=False)
    cleanup_and_select(args.system)
    export_glb(target)
    print(f"EXPORTED {target}")


if __name__ == "__main__":
    main()
