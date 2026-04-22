import argparse
import math
import os
import sys

import bpy
from mathutils import Vector


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    parser = argparse.ArgumentParser(description="Render a transparent PNG thumbnail from a GLB model.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--color", default="#ffffff")
    return parser.parse_args(argv)


def reset_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def hex_to_rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) / 255 for i in (0, 2, 4))


def clean_helpers():
    remove_words = ("line", "path", "guide", "helper", "axis", "grid", "label", "text", "curve", "annotation")
    for obj in list(bpy.context.scene.objects):
        name = f"{obj.name} {obj.type}".lower()
        if obj.type in {"CURVE", "FONT", "EMPTY"} or any(word in name for word in remove_words):
            bpy.data.objects.remove(obj, do_unlink=True)


def normalize_model():
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not meshes:
        return Vector((0, 0, 0)), 1
    min_corner = Vector((math.inf, math.inf, math.inf))
    max_corner = Vector((-math.inf, -math.inf, -math.inf))
    for obj in meshes:
        for corner in obj.bound_box:
            world = obj.matrix_world @ Vector(corner)
            min_corner.x = min(min_corner.x, world.x)
            min_corner.y = min(min_corner.y, world.y)
            min_corner.z = min(min_corner.z, world.z)
            max_corner.x = max(max_corner.x, world.x)
            max_corner.y = max(max_corner.y, world.y)
            max_corner.z = max(max_corner.z, world.z)

    center = (min_corner + max_corner) * 0.5
    size = max_corner - min_corner
    scale = 4.2 / max(size.x, size.y, size.z, 0.001)
    root = bpy.data.objects.new("thumbnail_root", None)
    bpy.context.collection.objects.link(root)
    for obj in meshes:
        obj.parent = root
    root.location = -center
    root.scale = (scale, scale, scale)
    bpy.context.view_layer.update()
    return Vector((0, 0, 0)), 4.2


def recolor_flat(color_hex):
    color = (*hex_to_rgb(color_hex), 1)
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        for slot in obj.material_slots:
            material = slot.material
            if not material:
                continue
            material.diffuse_color = color
            if material.use_nodes:
                base = material.node_tree.nodes.get("Principled BSDF")
                if base:
                    base.inputs["Base Color"].default_value = color
                    base.inputs["Roughness"].default_value = 0.72
                    base.inputs["Metallic"].default_value = 0


def setup_camera(output):
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 700
    scene.render.resolution_y = 900
    scene.render.film_transparent = True
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "Medium High Contrast"
    scene.world = bpy.data.worlds.new("thumbnail_world")
    scene.world.color = (0, 0, 0)

    bpy.ops.object.light_add(type="AREA", location=(0, -4, 5))
    light = bpy.context.object
    light.name = "thumbnail_key"
    light.data.energy = 550
    light.data.size = 5

    bpy.ops.object.camera_add(location=(0, -7.2, 2.25), rotation=(math.radians(74), 0, 0))
    camera = bpy.context.object
    scene.camera = camera
    scene.render.filepath = os.path.abspath(output)


def main():
    args = parse_args()
    reset_scene()
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(args.input))
    clean_helpers()
    normalize_model()
    recolor_flat(args.color)
    setup_camera(args.output)
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    main()
