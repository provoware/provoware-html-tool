from app.paths import build_app_paths


def test_build_app_paths_uses_runtime_data_root(tmp_path):
    paths = build_app_paths(tmp_path)
    assert paths.data_dir == tmp_path / "runtime_data"
    assert paths.projects_dir == tmp_path / "runtime_data" / "projects"
